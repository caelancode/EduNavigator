import type { Strategy } from '../../types/strategy';

const DELIMITER = '===STRATEGIES_JSON===';

const validStrategies: Strategy[] = [
  {
    title: 'Visual Schedule Supports',
    why_fits:
      'Visual schedules provide predictable structure for students with significant cognitive disabilities, reducing anxiety and increasing independence.',
    how_to:
      '1. Create a visual schedule using pictures or symbols.\n2. Review the schedule with the student at the start of each activity.\n3. Allow the student to remove or check off completed items.\n4. Reinforce schedule-following behavior with specific praise.',
    supporting_excerpt:
      'Visual supports, including schedules, have been shown to increase on-task behavior and reduce challenging behaviors in students with significant cognitive disabilities (Browder et al., 2014).',
    source_ref:
      'Browder, D. M., Wood, L., Thompson, J., & Ribuffo, C. (2014). Evidence-based practices for students with severe disabilities. University of Florida.',
  },
  {
    title: 'Systematic Prompting with Time Delay',
    why_fits:
      'Time delay is an evidence-based prompting strategy that promotes errorless learning while gradually transferring stimulus control to natural cues.',
    how_to:
      '1. Identify the target skill and natural cue.\n2. Begin with a 0-second delay (immediate prompt after cue).\n3. Gradually increase the delay interval (e.g., 2, 4, 6 seconds).\n4. Provide praise for correct responses before or after the prompt.\n5. Collect data on prompted vs. unprompted correct responses.',
    supporting_excerpt:
      'Constant and progressive time delay procedures are among the most well-researched instructional strategies for students with significant cognitive disabilities (Collins, 2012).',
    source_ref:
      'Collins, B. C. (2012). Systematic instruction for students with moderate and severe disabilities. Paul H. Brookes Publishing.',
  },
  {
    title: 'Peer-Mediated Instruction',
    why_fits:
      'Peer-mediated strategies leverage natural social interactions to support learning and inclusion for students with significant cognitive disabilities.',
    how_to:
      '1. Select and train peer partners on interaction strategies.\n2. Structure activities with clear roles for each partner.\n3. Provide visual or written cue cards for peer partners.\n4. Monitor interactions and provide feedback.\n5. Rotate peer partners regularly to build broader social connections.',
    supporting_excerpt:
      'Peer-mediated interventions have demonstrated positive outcomes in both academic and social domains for students with significant cognitive disabilities (Carter et al., 2015).',
    source_ref:
      'Carter, E. W., Moss, C. K., Hoffman, A., Chung, Y., & Sisco, L. (2015). Efficacy and social validity of peer support arrangements. Exceptional Children, 78(1), 107-125.',
  },
];

export function createValidResponse(): string {
  const chatText =
    "Great question! Based on the context you've provided, here are three evidence-based strategies that should work well in your setting. Each one has been selected to match your grade band, grouping arrangement, and available time.";
  return `${chatText}\n\n${DELIMITER}\n${JSON.stringify(validStrategies, null, 2)}`;
}

export function createNetworkErrorResponse(): never {
  throw new TypeError('Failed to fetch');
}

export function createTimeoutResponse(): Promise<never> {
  return new Promise((_resolve, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), 31000);
  });
}

export function createMissingDelimiterResponse(): string {
  return "Here are some strategies that might help. I recommend trying visual supports and peer-mediated instruction for your classroom setting. These approaches work well for the grade band you've selected.";
}

export function createInvalidJsonResponse(): string {
  const chatText = 'Here are some recommendations for you.';
  return `${chatText}\n\n${DELIMITER}\n{not valid json at all!!!`;
}

export function createNotArrayResponse(): string {
  const chatText = 'Here are some strategies.';
  return `${chatText}\n\n${DELIMITER}\n{"title": "This is an object, not an array"}`;
}

export function createSchemaViolationResponse(): string {
  const chatText = 'I found some strategies for you.';
  const badStrategies = [
    { title: 'Valid Title' },
    { title: '', why_fits: '', how_to: '', supporting_excerpt: '', source_ref: '' },
    validStrategies[0],
  ];
  return `${chatText}\n\n${DELIMITER}\n${JSON.stringify(badStrategies)}`;
}

export function createNoValidStrategiesResponse(): string {
  const chatText = "I wasn't able to find matching strategies.";
  return `${chatText}\n\n${DELIMITER}\n[]`;
}

export function createEmptyResponse(): string {
  return '';
}

export function createRateLimitedResponse(): Response {
  return new Response('Too Many Requests', {
    status: 429,
    statusText: 'Too Many Requests',
    headers: { 'Retry-After': '60' },
  });
}

export function createTruncatedResponse(): string {
  const chatText = 'Here are strategies.';
  return `${chatText}\n\n${DELIMITER}\n[{"title": "Truncated", "why_fits": "This gets cut`;
}

export function createDoubleDelimiterResponse(): string {
  const chatText = `I found strategies. Note: the format uses ${DELIMITER} as a separator.`;
  return `${chatText}\n\n${DELIMITER}\n${JSON.stringify([validStrategies[0]])}`;
}

export function createJsonInChatResponse(): string {
  const chatText = `Here is an example JSON: ${JSON.stringify([validStrategies[0]])} — but the real strategies are below.`;
  return `${chatText}\n\n${DELIMITER}\n${JSON.stringify([validStrategies[1]])}`;
}

export function createExtraPropertiesResponse(): string {
  const chatText = 'Strategies with extra fields.';
  const strategies = [
    { ...validStrategies[0], extra_field: 'should be stripped', confidence: 0.95 },
  ];
  return `${chatText}\n\n${DELIMITER}\n${JSON.stringify(strategies)}`;
}

export function createXssInjectionResponse(): string {
  const chatText = 'Here are strategies.';
  const strategies = [
    {
      title: '<script>alert("xss")</script>Visual Supports',
      why_fits: '<img onerror="alert(1)" src="x">This fits because...',
      how_to: '<a href="javascript:void(0)">Click here</a> for steps',
      supporting_excerpt: 'Normal excerpt text',
      source_ref: 'Normal source (2024).',
    },
  ];
  return `${chatText}\n\n${DELIMITER}\n${JSON.stringify(strategies)}`;
}

export function createNullFieldsResponse(): string {
  const chatText = 'Strategies with null fields.';
  const strategies = [
    {
      title: null,
      why_fits: 'Some reason',
      how_to: 'Some steps',
      supporting_excerpt: null,
      source_ref: 'Source',
    },
  ];
  return `${chatText}\n\n${DELIMITER}\n${JSON.stringify(strategies)}`;
}

export function createUnicodeResponse(): string {
  const chatText = 'Strategies with unicode content.';
  const strategies = [
    {
      title: 'Estrategia de apoyo visual \ud83c\udf1f',
      why_fits: '\u0627\u0633\u062a\u0631\u0627\u062a\u064a\u062c\u064a\u0629 \u062f\u0627\u0639\u0645\u0629 \u2014 fits well for diverse learners',
      how_to: '1. \u6b65\u9aa4\u4e00: Setup\n2. \u30b9\u30c6\u30c3\u30d7\u4e8c: Implement\n3. Step three: Review',
      supporting_excerpt: 'Research supports \u201cculturally responsive\u201d approaches (p. 42).',
      source_ref: 'Garc\u00eda, E. & M\u00fcller, K. (2023). \u00c9ducation inclusive. Routledge.',
    },
  ];
  return `${chatText}\n\n${DELIMITER}\n${JSON.stringify(strategies)}`;
}

export function createLargeResponse(): string {
  const chatText = 'A '.repeat(12000) + 'large response.';
  const strategies = Array.from({ length: 3 }, (_, i) => ({
    title: `Strategy ${i + 1}`,
    why_fits: 'R'.repeat(1999),
    how_to: 'S'.repeat(4999),
    supporting_excerpt: 'E'.repeat(1999),
    source_ref: `Author ${i + 1} (2024). Title. Publication.`,
  }));
  return `${chatText}\n\n${DELIMITER}\n${JSON.stringify(strategies)}`;
}

export { validStrategies, DELIMITER };
