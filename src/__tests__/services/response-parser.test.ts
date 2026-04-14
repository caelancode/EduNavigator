import { describe, it, expect } from 'vitest';
import { parseResponse } from '../../services/response-parser';
import { validateContextUpdate } from '../../services/context-update-validator';

const DELIMITER = '===STRATEGIES_JSON===';
const CONTEXT_DELIMITER = '===CONTEXT_UPDATE===';

// ── New-format fixtures (with steps, context_tagline, quick_version) ─────────

const VALID_STRATEGY = {
  title: 'Visual Schedule Supports',
  context_tagline: 'Works well for students who need predictable transitions.',
  quick_version: 'Post a visual schedule at the student\'s eye level. Point to each item before transitions. Praise the student when they follow the schedule independently.',
  steps: {
    prep: ['Print or create visual schedule cards', 'Laminate and velcro cards to a board'],
    during: ['Point to the current activity', 'Use a "first-then" frame for transitions'],
    follow_up: ['Track independent schedule-following on a data sheet'],
  },
  why_fits: 'Visual schedules help students understand transitions and expectations.',
  supporting_excerpt: 'Visual supports have been shown to reduce anxiety and increase independence.',
  source_ref: 'Meadan, H. (2011). Visual Supports for Students. Journal of Special Education.',
};

const SECOND_STRATEGY = {
  title: 'Peer-Mediated Instruction',
  context_tagline: 'Best for inclusive settings where peer interaction is a goal.',
  quick_version: 'Pair the student with a trained peer buddy. Provide structured prompts for the peer to use. Rotate peer partners to build social variety.',
  steps: {
    prep: ['Select and train peer buddies', 'Prepare interaction scripts'],
    during: ['Structure interaction opportunities', 'Give peers prompts when needed'],
    follow_up: ['Collect data on social initiations'],
  },
  why_fits: 'Peers can model appropriate behaviors and provide natural reinforcement.',
  supporting_excerpt: 'Peer-mediated approaches increase social engagement.',
  source_ref: 'Carter, E. (2015). Peer Support Strategies. Exceptional Children.',
};

const THIRD_STRATEGY = {
  title: 'Systematic Prompting with Time Delay',
  context_tagline: 'Effective for teaching discrete skills across all settings.',
  quick_version: 'Identify the target skill and deliver a prompt after a brief pause. Gradually increase the delay between the cue and the prompt as the student responds.',
  steps: {
    prep: ['Identify target skill and task analysis', 'Choose prompt hierarchy'],
    during: ['Use constant time delay: cue → 3-second pause → prompt', 'Reinforce correct responses immediately'],
    follow_up: ['Graph probe data weekly', 'Fade prompts when criterion is met'],
  },
  why_fits: 'Systematic prompting allows gradual fading of supports.',
  supporting_excerpt: 'Time delay procedures are evidence-based for teaching discrete skills.',
  source_ref: 'Browder, D. (2014). Systematic Instruction. Research in Developmental Disabilities.',
};

// ── Legacy-format fixtures (with how_to, no steps/context_tagline/quick_version) ─

const LEGACY_STRATEGY = {
  title: 'Visual Schedule Supports',
  why_fits: 'Visual schedules help students understand transitions and expectations.',
  how_to: '1. Create a visual schedule\n2. Present it to the student\n3. Guide through each step',
  supporting_excerpt: 'Visual supports have been shown to reduce anxiety and increase independence.',
  source_ref: 'Meadan, H. (2011). Visual Supports for Students. Journal of Special Education.',
};

const LEGACY_STRATEGY_2 = {
  title: 'Peer-Mediated Instruction',
  why_fits: 'Peers can model appropriate behaviors and provide natural reinforcement.',
  how_to: '1. Select and train peer buddies\n2. Structure interaction opportunities',
  supporting_excerpt: 'Peer-mediated approaches increase social engagement.',
  source_ref: 'Carter, E. (2015). Peer Support Strategies. Exceptional Children.',
};

function makeResponse(chat: string, strategies: unknown[]): string {
  return `${chat}\n${DELIMITER}\n${JSON.stringify(strategies)}`;
}

function makeThreePartResponse(
  chat: string,
  strategies: unknown[],
  contextUpdate: unknown,
): string {
  return `${chat}\n${DELIMITER}\n${JSON.stringify(strategies)}\n${CONTEXT_DELIMITER}\n${JSON.stringify(contextUpdate)}`;
}

describe('parseResponse', () => {
  // ── New-format tests ────────────────────────────────────────────────────────

  it('parses a valid new-format response with 3 strategies', () => {
    const result = parseResponse(makeResponse(
      'Here are some evidence-based strategies for your student.',
      [VALID_STRATEGY, SECOND_STRATEGY, THIRD_STRATEGY],
    ));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(3);
      expect(result.chatText).toContain('evidence-based strategies');
      expect(result.strategies[0].title).toBe('Visual Schedule Supports');
      expect(result.strategies[0].context_tagline).toBe('Works well for students who need predictable transitions.');
      expect(result.strategies[0].quick_version).toContain('Post a visual schedule');
      expect(result.strategies[0].steps?.prep).toHaveLength(2);
      expect(result.strategies[0].steps?.during).toHaveLength(2);
      expect(result.strategies[0].steps?.follow_up).toHaveLength(1);
    }
  });

  it('normalizes new-format strategy — context_tagline and quick_version are present', () => {
    const result = parseResponse(makeResponse('Chat.', [VALID_STRATEGY]));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies[0].context_tagline).toBeTruthy();
      expect(result.strategies[0].quick_version).toBeTruthy();
    }
  });

  // ── Legacy-format backward-compatibility tests ──────────────────────────────

  it('parses a legacy-format response (how_to, no steps) and synthesizes new fields', () => {
    const result = parseResponse(makeResponse('Chat text.', [LEGACY_STRATEGY]));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(1);
      expect(result.strategies[0].title).toBe('Visual Schedule Supports');
      // Normalization should synthesize context_tagline from why_fits
      expect(result.strategies[0].context_tagline).toBeTruthy();
      // Normalization should synthesize quick_version from how_to
      expect(result.strategies[0].quick_version).toBeTruthy();
      // steps should be undefined for legacy format
      expect(result.strategies[0].steps).toBeUndefined();
      // how_to should be preserved
      expect(result.strategies[0].how_to).toContain('Create a visual schedule');
    }
  });

  it('parses legacy-format response with 2 strategies', () => {
    const result = parseResponse(makeResponse('Chat.', [LEGACY_STRATEGY, LEGACY_STRATEGY_2]));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(2);
      expect(result.strategies[1].title).toBe('Peer-Mediated Instruction');
    }
  });

  it('rejects strategy with neither steps nor how_to', () => {
    const noImplementation = {
      title: 'Incomplete Strategy',
      why_fits: 'This is a valid rationale.',
      supporting_excerpt: 'Research excerpt.',
      source_ref: 'Author (2020). Title. Journal.',
      context_tagline: 'Context here.',
      quick_version: 'Quick version here.',
      // no steps, no how_to
    };
    const result = parseResponse(makeResponse('Chat.', [noImplementation]));
    // Should be filtered out
    if (result.ok) {
      expect(result.strategies).toHaveLength(0);
    } else {
      expect(result.error.code).toMatch(/schema_violation|no_valid_strategies/);
    }
  });

  // ── XSS sanitization for new fields ────────────────────────────────────────

  it('strips XSS from context_tagline and quick_version', () => {
    const xssStrategy = {
      ...VALID_STRATEGY,
      context_tagline: '<script>alert("xss")</script>Works well for students.',
      quick_version: '<img src=x onerror=alert(1)>Post a visual schedule.',
    };
    const result = parseResponse(makeResponse('Chat.', [xssStrategy]));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies[0].context_tagline).not.toContain('<script>');
      expect(result.strategies[0].quick_version).not.toContain('onerror');
    }
  });

  it('strips XSS from steps array items', () => {
    const xssSteps = {
      ...VALID_STRATEGY,
      steps: {
        prep: ['<script>alert(1)</script>Prepare materials'],
        during: ['<a href="javascript:void(0)">Click</a> to continue'],
        follow_up: ['Track data <img src=x onerror=alert(1)>'],
      },
    };
    const result = parseResponse(makeResponse('Chat.', [xssSteps]));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies[0].steps?.prep[0]).not.toContain('<script>');
      expect(result.strategies[0].steps?.during[0]).not.toContain('javascript:');
      expect(result.strategies[0].steps?.follow_up[0]).not.toContain('onerror');
    }
  });

  it('strips HTML/script injection from legacy how_to via DOMPurify', () => {
    const xssStrategy = {
      title: '<script>alert("xss")</script>Visual Supports',
      why_fits: '<img src=x onerror=alert(1)>Good strategy',
      how_to: '<a href="javascript:alert(1)">Click here</a> to implement',
      supporting_excerpt: 'Clean excerpt.',
      source_ref: 'Clean source.',
    };
    const result = parseResponse(makeResponse('Chat text.', [xssStrategy]));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(1);
      expect(result.strategies[0].title).not.toContain('<script>');
      expect(result.strategies[0].why_fits).not.toContain('onerror');
      expect(result.strategies[0].how_to).not.toContain('javascript:');
    }
  });

  // ── Existing error-handling tests ──────────────────────────────────────────

  it('handles truncated response (cuts off mid-JSON)', () => {
    const raw = `Here are strategies.\n${DELIMITER}\n[{"title": "Visual Schedule Supports", "why_fi`;
    const result = parseResponse(raw);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('invalid_json');
      expect(result.chatText).toBe('Here are strategies.');
    }
  });

  it('handles missing delimiter', () => {
    const result = parseResponse('Here are some strategies for your student. No delimiter here.');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('missing_delimiter');
      expect(result.chatText).toContain('strategies');
    }
  });

  it('handles double delimiter by splitting on first occurrence', () => {
    const raw = `Chat text\n${DELIMITER}\n${DELIMITER}\n${JSON.stringify([VALID_STRATEGY])}`;
    const result = parseResponse(raw);
    expect(result.chatText).toBeDefined();
    if (result.ok) {
      expect(result.strategies.length).toBeGreaterThanOrEqual(1);
    } else {
      expect(result.error.code).toMatch(/invalid_json|missing_delimiter/);
    }
  });

  it('ignores valid JSON in pre-delimiter chat text', () => {
    const chatWithJson = 'Here is some context: [{"fake": true}] and more text.';
    const result = parseResponse(makeResponse(chatWithJson, [THIRD_STRATEGY]));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(1);
      expect(result.strategies[0].title).toBe('Systematic Prompting with Time Delay');
    }
  });

  it('filters out objects with missing required fields', () => {
    const strategies = [
      { title: 'Missing fields' },
      { title: 'Also missing', why_fits: 'partial' },
      VALID_STRATEGY,
    ];
    const result = parseResponse(makeResponse('Chat text.', strategies));
    if (result.ok) {
      expect(result.strategies).toHaveLength(1);
      expect(result.strategies[0].title).toBe('Visual Schedule Supports');
    } else {
      expect(result.error.code).toMatch(/schema_violation|no_valid_strategies/);
    }
  });

  it('strips extra properties and retains valid strategies', () => {
    const withExtras = { ...VALID_STRATEGY, extra_field: 'should be stripped', confidence: 0.95 };
    const result = parseResponse(makeResponse('Chat text.', [withExtras]));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(1);
      expect(result.strategies[0].title).toBe('Visual Schedule Supports');
      expect('extra_field' in result.strategies[0]).toBe(false);
      expect('confidence' in result.strategies[0]).toBe(false);
    }
  });

  it('parses 50KB+ response within 50ms', () => {
    const longText = 'A'.repeat(50000);
    const raw = makeResponse(longText, [VALID_STRATEGY, SECOND_STRATEGY, THIRD_STRATEGY]);
    expect(raw.length).toBeGreaterThan(50000);

    const start = performance.now();
    const result = parseResponse(raw);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(50);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(3);
    }
  });

  it('handles empty JSON array', () => {
    const result = parseResponse(makeResponse("I wasn't able to find specific strategies.", []));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(0);
      expect(result.chatText).toContain("wasn't able to find");
    }
  });

  it('handles null values in required string fields', () => {
    const withNulls = { title: null, why_fits: null, how_to: null, supporting_excerpt: null, source_ref: null };
    const result = parseResponse(makeResponse('Chat text.', [withNulls]));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('schema_violation');
    }
  });

  it('handles unicode edge cases (emoji, RTL, special chars)', () => {
    const unicodeStrategy = {
      ...VALID_STRATEGY,
      title: '\ud83c\udf1f Visual Supports \u2014 \u0645\u0631\u062d\u0628\u0627',
      why_fits: 'Supports d\u00e9veloppement with caf\u00e9-style learning.',
      source_ref: 'Garc\u00eda, M. (2020). Ense\u00f1anza Inclusiva. Revista Especial.',
    };
    const result = parseResponse(makeResponse('Chat text.', [unicodeStrategy]));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(1);
      expect(result.strategies[0].title).toContain('\ud83c\udf1f');
      expect(result.strategies[0].source_ref).toContain('Garc\u00eda');
    }
  });

  it('handles invalid JSON (not parseable)', () => {
    const result = parseResponse(`Chat text.\n${DELIMITER}\n{not valid json at all}`);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('invalid_json');
    }
  });

  it('handles parsed JSON that is not an array', () => {
    const result = parseResponse(`Chat text.\n${DELIMITER}\n${JSON.stringify({ not: 'an array' })}`);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('not_array');
    }
  });

  it('handles empty string response', () => {
    const result = parseResponse('');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('empty_response');
    }
  });

  // ── Three-part response tests (===CONTEXT_UPDATE===) ──────────────────────

  it('parses a valid three-part response with context update', () => {
    const contextUpdate = {
      updates: { gradeBand: '3_5', supportArea: 'behavior_support' },
      nextQuestion: {
        field: 'grouping',
        text: 'Working one-on-one or in a group?',
        options: ['one_on_one', 'small_group', 'whole_class', 'mixed'],
      },
    };
    const result = parseResponse(
      makeThreePartResponse('Chat text.', [VALID_STRATEGY], contextUpdate),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(1);
      expect(result.chatText).toBe('Chat text.');
      expect(result.contextUpdate).toBeDefined();
      expect(result.contextUpdate?.updates).toEqual({
        gradeBand: '3_5',
        supportArea: 'behavior_support',
      });
      expect(result.contextUpdate?.nextQuestion?.field).toBe('grouping');
      expect(result.contextUpdate?.nextQuestion?.options).toHaveLength(4);
    }
  });

  it('parses two-part response without CONTEXT_UPDATE — contextUpdate is undefined', () => {
    const result = parseResponse(makeResponse('Chat text.', [VALID_STRATEGY]));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(1);
      expect(result.contextUpdate).toBeUndefined();
    }
  });

  it('handles malformed CONTEXT_UPDATE JSON — strategies still parse correctly', () => {
    const raw = `Chat text.\n${DELIMITER}\n${JSON.stringify([VALID_STRATEGY])}\n${CONTEXT_DELIMITER}\n{not valid json}`;
    const result = parseResponse(raw);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(1);
      expect(result.contextUpdate).toBeUndefined();
    }
  });

  it('rejects invalid enum values in CONTEXT_UPDATE', () => {
    const contextUpdate = {
      updates: { gradeBand: 'invalid_grade', supportArea: 'behavior_support' },
    };
    const result = parseResponse(
      makeThreePartResponse('Chat.', [VALID_STRATEGY], contextUpdate),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(1);
      // gradeBand rejected, supportArea accepted
      expect(result.contextUpdate?.updates.gradeBand).toBeUndefined();
      expect(result.contextUpdate?.updates.supportArea).toBe('behavior_support');
    }
  });

  it('returns contextUpdate undefined for empty updates with no question', () => {
    const contextUpdate = { updates: {} };
    const result = parseResponse(
      makeThreePartResponse('Chat.', [VALID_STRATEGY], contextUpdate),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.contextUpdate).toBeUndefined();
    }
  });

  it('returns contextUpdate with only nextQuestion (no updates)', () => {
    const contextUpdate = {
      updates: {},
      nextQuestion: {
        field: 'gradeBand',
        text: 'What grade band?',
        options: ['prek_2', '3_5', '6_8'],
      },
    };
    const result = parseResponse(
      makeThreePartResponse('Chat.', [VALID_STRATEGY], contextUpdate),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.contextUpdate).toBeDefined();
      expect(result.contextUpdate?.nextQuestion?.field).toBe('gradeBand');
    }
  });

  it('parses three-part response with empty strategies array + valid context update', () => {
    const contextUpdate = {
      updates: { supportArea: 'communication_aac' },
    };
    const result = parseResponse(
      makeThreePartResponse('Chat.', [], contextUpdate),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(0);
      expect(result.contextUpdate?.updates.supportArea).toBe('communication_aac');
    }
  });

  it('handles AI response with trailing === markers around JSON blocks', () => {
    const raw = `Chat text.\n===STRATEGIES_JSON===\n${JSON.stringify([VALID_STRATEGY])}\n===\n\n===CONTEXT_UPDATE===\n${JSON.stringify({ updates: { gradeBand: '3_5' } })}\n===`;
    const result = parseResponse(raw);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.strategies).toHaveLength(1);
      expect(result.contextUpdate?.updates.gradeBand).toBe('3_5');
    }
  });

  it('strips unknown fields from context update updates', () => {
    const contextUpdate = {
      updates: {
        gradeBand: '6_8',
        unknownField: 'should_be_stripped',
        learnerCharacteristics: { communicationLevel: ['verbal_fluent'] },
      },
    };
    const result = parseResponse(
      makeThreePartResponse('Chat.', [VALID_STRATEGY], contextUpdate),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.contextUpdate?.updates.gradeBand).toBe('6_8');
      expect('unknownField' in (result.contextUpdate?.updates ?? {})).toBe(false);
      expect('learnerCharacteristics' in (result.contextUpdate?.updates ?? {})).toBe(false);
    }
  });
});

// ── Context Update Validator unit tests ─────────────────────────────────────

describe('validateContextUpdate', () => {
  it('validates a complete context update with updates and nextQuestion', () => {
    const result = validateContextUpdate({
      updates: { gradeBand: '3_5', setting: 'general_ed' },
      nextQuestion: {
        field: 'grouping',
        text: 'How is the student grouped?',
        options: ['one_on_one', 'small_group'],
      },
    });
    expect(result).not.toBeNull();
    expect(result?.updates.gradeBand).toBe('3_5');
    expect(result?.updates.setting).toBe('general_ed');
    expect(result?.nextQuestion?.field).toBe('grouping');
  });

  it('returns null for empty updates with no question', () => {
    expect(validateContextUpdate({ updates: {} })).toBeNull();
  });

  it('returns null for non-object input', () => {
    expect(validateContextUpdate('string')).toBeNull();
    expect(validateContextUpdate(42)).toBeNull();
    expect(validateContextUpdate(null)).toBeNull();
    expect(validateContextUpdate(undefined)).toBeNull();
  });

  it('strips fields with invalid enum values', () => {
    const result = validateContextUpdate({
      updates: { gradeBand: 'bogus', setting: 'general_ed' },
    });
    expect(result).not.toBeNull();
    expect(result?.updates.gradeBand).toBeUndefined();
    expect(result?.updates.setting).toBe('general_ed');
  });

  it('strips non-extractable fields like learnerCharacteristics', () => {
    const result = validateContextUpdate({
      updates: {
        gradeBand: '6_8',
        learnerCharacteristics: { communicationLevel: ['verbal_fluent'] },
      },
    });
    expect(result).not.toBeNull();
    expect(result?.updates.gradeBand).toBe('6_8');
    expect('learnerCharacteristics' in (result?.updates ?? {})).toBe(false);
  });

  it('accepts all valid support area values', () => {
    for (const area of [
      'instructional_support',
      'behavior_support',
      'communication_aac',
      'functional_life_skills',
      'collaboration_planning',
    ]) {
      const result = validateContextUpdate({
        updates: { supportArea: area },
      });
      expect(result?.updates.supportArea).toBe(area);
    }
  });

  it('accepts valid sub-area values from any support area', () => {
    const result = validateContextUpdate({
      updates: { subArea: 'literacy' },
    });
    expect(result?.updates.subArea).toBe('literacy');
  });

  it('sanitizes XSS in nextQuestion text', () => {
    const result = validateContextUpdate({
      updates: { gradeBand: '3_5' },
      nextQuestion: {
        field: 'grouping',
        text: '<script>alert("xss")</script>How are they grouped?',
        options: ['one_on_one'],
      },
    });
    expect(result).not.toBeNull();
    expect(result?.nextQuestion?.text).not.toContain('<script>');
    expect(result?.nextQuestion?.text).toContain('How are they grouped?');
  });
});
