export type TestCategory =
  | 'context-completeness'
  | 'message-specificity'
  | 'role-expertise'
  | 'emotional-state'
  | 'support-area-coverage'
  | 'learner-complexity'
  | 'guardrail'
  | 'multi-turn'
  | 'age-appropriateness'
  | 'tech-constraint'
  | 'output-preference'
  | 'settings-update';

export interface TestCase {
  id: string;
  name: string;
  description: string;
  category: TestCategory;
  priority: 'core' | 'extended';
  request: {
    sessionId: string;
    message: string;
    context: {
      gradeBand?: string;
      setting?: string;
      grouping?: string;
      timeRange?: string;
      techContext?: string;
      supportArea?: string;
      subArea?: string;
      outputPreference?: string;
      rolePerspective?: string;
      learnerCharacteristics?: {
        communicationLevel?: string[];
        mobilityLevel?: string[];
        sensoryConsiderations?: string[];
        behavioralConsiderations?: string[];
      };
      stepNotes?: Record<string, string>;
      wizardCompleted?: boolean;
    };
    history: Array<{
      id: string;
      role: 'user' | 'assistant';
      content: string;
      timestamp: number;
    }>;
  };
  expectations: {
    shouldHaveStrategies: boolean;
    strategyCountRange?: [number, number];
    shouldAskClarifyingQuestions?: boolean;
    shouldReflectBackContext?: boolean;
    shouldTriggerGuardrail?: 'crisis' | 'off-topic' | 'medical' | 'restraint' | null;
    mustNotContain?: string[];
    shouldMentionSettingsPanel?: boolean;
    shouldContainCitations?: boolean;
    ageAppropriate?: boolean;
    techConstraintRespected?: boolean;
    responseFormat: {
      hasDelimiter: boolean;
      jsonIsValidArray: boolean;
      strategiesPassZod: boolean;
    };
  };
}

export interface TestCaseFile {
  metadata: {
    version: string;
    createdAt: string;
    totalCases: number;
    coreCases: number;
    researchSummary: string;
  };
  testCases: TestCase[];
}

export type CheckResult = 'pass' | 'warn' | 'fail' | 'na';

export interface CheckDetail {
  name: string;
  result: CheckResult;
  message: string;
}

export interface TestResult {
  id: string;
  name: string;
  category: TestCategory;
  priority: 'core' | 'extended';
  status: 'pass' | 'warn' | 'fail' | 'error';
  checks: CheckDetail[];
  rawResponse: string;
  chatText: string;
  strategiesRaw: unknown[] | null;
  strategiesValidated: number;
  durationMs: number;
  error?: string;
}

export interface TestReport {
  timestamp: string;
  totalTests: number;
  passed: number;
  warned: number;
  failed: number;
  errored: number;
  results: TestResult[];
  checkSummary: Record<string, { pass: number; warn: number; fail: number; na: number }>;
}
