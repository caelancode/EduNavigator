import type {
  GradeBand,
  Setting,
  Grouping,
  TimeRange,
  TechContext,
  OutputPreference,
  RolePerspective,
} from '../types/left-rail';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

export const GRADE_BAND_OPTIONS: SelectOption<GradeBand>[] = [
  { value: 'prek_2', label: 'Pre-K – 2' },
  { value: '3_5', label: 'Grades 3–5' },
  { value: '6_8', label: 'Grades 6–8' },
  { value: '9_12', label: 'Grades 9–12' },
  { value: '18_22', label: 'Transition (18–22)' },
];

export const SETTING_OPTIONS: SelectOption<Setting>[] = [
  { value: 'general_ed', label: 'General Education' },
  { value: 'resource_room', label: 'Resource Room' },
  { value: 'self_contained', label: 'Self-Contained' },
  { value: 'community', label: 'Community-Based' },
  { value: 'home', label: 'Home' },
];

export const GROUPING_OPTIONS: SelectOption<Grouping>[] = [
  { value: 'one_on_one', label: '1:1' },
  { value: 'small_group', label: 'Small Group' },
  { value: 'whole_class', label: 'Whole Class' },
  { value: 'mixed', label: 'Mixed' },
];

export const TIME_RANGE_OPTIONS: SelectOption<TimeRange>[] = [
  { value: '5_10', label: '5–10 minutes' },
  { value: '11_20', label: '11–20 minutes' },
  { value: '21_30', label: '21–30 minutes' },
  { value: '31_45', label: '31–45 minutes' },
  { value: '46_plus', label: '46+ minutes' },
];

export const TECH_CONTEXT_OPTIONS: SelectOption<TechContext>[] = [
  { value: 'no_tech', label: 'No Technology' },
  { value: 'basic_devices', label: 'Basic Devices' },
  { value: 'full_tech', label: 'Full Technology' },
  { value: 'assistive_tech', label: 'Assistive Technology' },
];

export const OUTPUT_PREFERENCE_OPTIONS: SelectOption<OutputPreference>[] = [
  { value: 'visual_supports', label: 'Visual Supports' },
  { value: 'lesson_plan_snippet', label: 'Lesson Plan Snippet' },
  { value: 'data_collection_idea', label: 'Data Collection Idea' },
  { value: 'parent_communication', label: 'Parent Communication' },
];

export const ROLE_PERSPECTIVE_OPTIONS: SelectOption<RolePerspective>[] = [
  { value: 'classroom_teacher', label: 'Classroom Teacher' },
  { value: 'special_educator', label: 'Special Educator' },
  { value: 'related_services', label: 'Related Services' },
  { value: 'paraprofessional', label: 'Paraprofessional' },
  { value: 'admin', label: 'Administrator' },
];

export const SUPPORT_AREA_OPTIONS: SelectOption[] = [
  { value: 'communication', label: 'Communication' },
  { value: 'literacy', label: 'Literacy' },
  { value: 'math', label: 'Mathematics' },
  { value: 'behavior', label: 'Behavior' },
  { value: 'social_skills', label: 'Social Skills' },
  { value: 'daily_living', label: 'Daily Living Skills' },
  { value: 'transition', label: 'Transition' },
  { value: 'sensory', label: 'Sensory' },
  { value: 'motor', label: 'Motor Skills' },
];

export const SUB_AREA_OPTIONS: Record<string, SelectOption[]> = {
  communication: [
    { value: 'expressive', label: 'Expressive Communication' },
    { value: 'receptive', label: 'Receptive Communication' },
    { value: 'aac', label: 'AAC (Augmentative & Alternative)' },
    { value: 'pragmatic', label: 'Pragmatic/Social Communication' },
  ],
  literacy: [
    { value: 'phonics', label: 'Phonics & Decoding' },
    { value: 'sight_words', label: 'Sight Words' },
    { value: 'comprehension', label: 'Comprehension' },
    { value: 'writing', label: 'Writing' },
  ],
  math: [
    { value: 'number_sense', label: 'Number Sense' },
    { value: 'operations', label: 'Operations' },
    { value: 'measurement', label: 'Measurement' },
    { value: 'functional_math', label: 'Functional Math' },
  ],
  behavior: [
    { value: 'positive_supports', label: 'Positive Behavior Supports' },
    { value: 'self_regulation', label: 'Self-Regulation' },
    { value: 'replacement_behaviors', label: 'Replacement Behaviors' },
  ],
  social_skills: [
    { value: 'peer_interaction', label: 'Peer Interaction' },
    { value: 'turn_taking', label: 'Turn-Taking' },
    { value: 'cooperative_learning', label: 'Cooperative Learning' },
  ],
  daily_living: [
    { value: 'self_care', label: 'Self-Care' },
    { value: 'meal_prep', label: 'Meal Preparation' },
    { value: 'money_management', label: 'Money Management' },
    { value: 'community_navigation', label: 'Community Navigation' },
  ],
  transition: [
    { value: 'vocational', label: 'Vocational Skills' },
    { value: 'self_determination', label: 'Self-Determination' },
    { value: 'independent_living', label: 'Independent Living' },
  ],
  sensory: [
    { value: 'sensory_diet', label: 'Sensory Diet' },
    { value: 'sensory_breaks', label: 'Sensory Breaks' },
    { value: 'environment_modifications', label: 'Environment Modifications' },
  ],
  motor: [
    { value: 'fine_motor', label: 'Fine Motor' },
    { value: 'gross_motor', label: 'Gross Motor' },
    { value: 'adaptive_equipment', label: 'Adaptive Equipment' },
  ],
};

export const COMMUNICATION_LEVEL_OPTIONS: SelectOption[] = [
  { value: 'pre_symbolic', label: 'Pre-Symbolic' },
  { value: 'emerging_symbolic', label: 'Emerging Symbolic' },
  { value: 'symbolic', label: 'Symbolic' },
  { value: 'verbal_limited', label: 'Verbal (Limited)' },
  { value: 'verbal_fluent', label: 'Verbal (Fluent)' },
  { value: 'aac_user', label: 'AAC User' },
];

export const MOBILITY_LEVEL_OPTIONS: SelectOption[] = [
  { value: 'independent', label: 'Independent' },
  { value: 'assisted_walking', label: 'Assisted Walking' },
  { value: 'wheelchair', label: 'Wheelchair User' },
  { value: 'limited_mobility', label: 'Limited Mobility' },
];

export const SENSORY_OPTIONS: SelectOption[] = [
  { value: 'visual_impairment', label: 'Visual Impairment' },
  { value: 'hearing_impairment', label: 'Hearing Impairment' },
  { value: 'sensory_seeking', label: 'Sensory Seeking' },
  { value: 'sensory_avoiding', label: 'Sensory Avoiding' },
  { value: 'none', label: 'No Significant Considerations' },
];

export const BEHAVIORAL_OPTIONS: SelectOption[] = [
  { value: 'elopement', label: 'Elopement Risk' },
  { value: 'self_injury', label: 'Self-Injurious Behavior' },
  { value: 'aggression', label: 'Aggression' },
  { value: 'non_compliance', label: 'Non-Compliance' },
  { value: 'attention', label: 'Attention Difficulties' },
  { value: 'none', label: 'No Significant Considerations' },
];
