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
  description?: string;
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
  { value: 'minimal_tech', label: 'Minimal Technology' },
  { value: 'specialized_tech', label: 'Specialized Technology' },
];

export const OUTPUT_PREFERENCE_OPTIONS: SelectOption<OutputPreference>[] = [
  { value: 'step_by_step', label: 'Step-by-Step' },
  { value: 'scripts', label: 'Scripts' },
  { value: 'quick_ideas', label: 'Quick Ideas' },
  { value: 'rationale', label: 'Rationale' },
];

export const ROLE_PERSPECTIVE_OPTIONS: SelectOption<RolePerspective>[] = [
  { value: 'classroom_teacher', label: 'Classroom Teacher' },
  { value: 'special_educator', label: 'Special Educator' },
  { value: 'related_services', label: 'Related Services' },
  { value: 'paraprofessional', label: 'Paraprofessional' },
  { value: 'admin', label: 'Administrator' },
];

export const SUPPORT_AREA_OPTIONS: SelectOption[] = [
  { value: 'instructional_support', label: 'Instructional Support' },
  { value: 'behavior_support', label: 'Behavior Support' },
  { value: 'communication_aac', label: 'Communication & AAC' },
  { value: 'functional_life_skills', label: 'Functional & Life Skills' },
  { value: 'collaboration_planning', label: 'Collaboration & Planning' },
];

export const SUB_AREA_OPTIONS: Record<string, SelectOption[]> = {
  instructional_support: [
    { value: 'literacy', label: 'Literacy' },
    { value: 'math', label: 'Mathematics' },
    { value: 'comprehension', label: 'Comprehension' },
    { value: 'writing', label: 'Writing' },
    { value: 'sensory_supports', label: 'Sensory Supports' },
    { value: 'motor_supports', label: 'Motor Supports' },
  ],
  behavior_support: [
    { value: 'positive_supports', label: 'Positive Behavior Supports' },
    { value: 'self_regulation', label: 'Self-Regulation' },
    { value: 'replacement_behaviors', label: 'Replacement Behaviors' },
    { value: 'social_skills', label: 'Social Skills' },
    { value: 'peer_interaction', label: 'Peer Interaction' },
  ],
  communication_aac: [
    { value: 'expressive', label: 'Expressive Communication' },
    { value: 'receptive', label: 'Receptive Communication' },
    { value: 'aac', label: 'AAC (Augmentative & Alternative)' },
    { value: 'pragmatic', label: 'Pragmatic/Social Communication' },
  ],
  functional_life_skills: [
    { value: 'self_care', label: 'Self-Care' },
    { value: 'meal_prep', label: 'Meal Preparation' },
    { value: 'money_management', label: 'Money Management' },
    { value: 'community_navigation', label: 'Community Navigation' },
    { value: 'vocational', label: 'Vocational Skills' },
    { value: 'independent_living', label: 'Independent Living' },
  ],
  collaboration_planning: [
    { value: 'team_coordination', label: 'Team Coordination' },
    { value: 'iep_implementation', label: 'IEP Implementation' },
    { value: 'family_engagement', label: 'Family Engagement' },
    { value: 'transition_planning', label: 'Transition Planning' },
    { value: 'self_determination', label: 'Self-Determination' },
  ],
};

export const COMMUNICATION_LEVEL_OPTIONS: SelectOption[] = [
  { value: 'pre_symbolic', label: 'Pre-Symbolic', description: 'Communicates through body movements, facial expressions, or cries' },
  { value: 'emerging_symbolic', label: 'Emerging Symbolic', description: 'Beginning to use gestures, pictures, or objects to communicate' },
  { value: 'symbolic', label: 'Symbolic', description: 'Uses symbols, signs, or words with consistent meaning' },
  { value: 'verbal_limited', label: 'Verbal (Limited)' },
  { value: 'verbal_fluent', label: 'Verbal (Fluent)' },
  { value: 'aac_user', label: 'AAC User', description: 'Uses augmentative/alternative communication devices or systems' },
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
  { value: 'elopement', label: 'Elopement Risk', description: 'May leave designated areas or attempt to run away' },
  { value: 'self_injury', label: 'Self-Injurious Behavior' },
  { value: 'aggression', label: 'Aggression' },
  { value: 'non_compliance', label: 'Non-Compliance' },
  { value: 'attention', label: 'Attention Difficulties' },
  { value: 'none', label: 'No Significant Considerations' },
];
