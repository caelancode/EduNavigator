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
  { value: 'prek_2', label: 'Pre-K – 2', description: 'Ages 3–7' },
  { value: '3_5', label: 'Grades 3–5', description: 'Ages 8–10' },
  { value: '6_8', label: 'Grades 6–8', description: 'Ages 11–13' },
  { value: '9_12', label: 'Grades 9–12', description: 'Ages 14–18' },
  { value: '18_22', label: 'Transition (18–22)', description: 'Ages 18–22' },
];

export const SETTING_OPTIONS: SelectOption<Setting>[] = [
  { value: 'general_ed', label: 'General Education', description: 'Inclusive classroom' },
  { value: 'resource_room', label: 'Resource Room', description: 'Pull-out support' },
  { value: 'self_contained', label: 'Self-Contained', description: 'Specialized classroom' },
  { value: 'community', label: 'Community-Based', description: 'Real-world settings' },
  { value: 'home', label: 'Home', description: 'Home instruction' },
  { value: 'other', label: 'Other', description: 'A different setting' },
];

export const GROUPING_OPTIONS: SelectOption<Grouping>[] = [
  { value: 'one_on_one', label: '1:1', description: 'Individual instruction with one student' },
  { value: 'small_group', label: 'Small Group', description: '2–5 students working together' },
  { value: 'whole_class', label: 'Whole Class', description: 'Full classroom instruction' },
  { value: 'mixed', label: 'Mixed', description: 'Switches between group sizes during the session' },
];

export const TIME_RANGE_OPTIONS: SelectOption<TimeRange>[] = [
  { value: '5_10', label: '5–10 minutes' },
  { value: '11_20', label: '11–20 minutes' },
  { value: '21_30', label: '21–30 minutes' },
  { value: '31_45', label: '31–45 minutes' },
  { value: '46_plus', label: '46+ minutes' },
];

export const TECH_CONTEXT_OPTIONS: SelectOption<TechContext>[] = [
  { value: 'no_tech', label: 'No Tech', description: 'No devices or software available' },
  { value: 'minimal_tech', label: 'Basic Devices', description: 'Tablets, computers, or simple apps' },
  { value: 'specialized_tech', label: 'Specialized/Assistive Tech', description: 'Communication devices, switches, adapted hardware, or specialized software' },
];

export const OUTPUT_PREFERENCE_OPTIONS: SelectOption<OutputPreference>[] = [
  { value: 'step_by_step', label: 'Step-by-Step Instructions', description: 'Numbered actions you can follow in sequence' },
  { value: 'scripts',      label: 'Ready-to-Use Scripts',      description: 'Word-for-word language and prompts to use directly' },
  { value: 'quick_ideas',  label: 'Quick Ideas I Can Try Now', description: 'Brief, actionable tips for immediate use' },
  { value: 'rationale',    label: 'Research Rationale',        description: 'Evidence-based explanations behind each strategy' },
];

export const ROLE_PERSPECTIVE_OPTIONS: SelectOption<RolePerspective>[] = [
  { value: 'classroom_teacher', label: 'Classroom Teacher', description: 'General education implementation focus' },
  { value: 'special_educator',  label: 'Special Educator',  description: 'Specialized instruction and IEP implementation' },
  { value: 'related_services',  label: 'Related Services',  description: 'OT, PT, SLP, or other discipline-specific lens' },
  { value: 'paraprofessional',  label: 'Paraprofessional',  description: 'Support and facilitation focus' },
  { value: 'admin',             label: 'Administrator',     description: 'Team-level and program recommendations' },
  { value: 'other',             label: 'Other' },
];

export interface CardOption extends SelectOption {
  icon: 'book' | 'brain' | 'chat' | 'person' | 'group';
}

export const SUPPORT_AREA_OPTIONS: CardOption[] = [
  { value: 'instructional_support', label: 'Instructional Support', description: 'Academics and learning.', icon: 'book' },
  { value: 'behavior_support', label: 'Behavior Support', description: 'Managing challenging behaviors.', icon: 'brain' },
  { value: 'communication_aac', label: 'Communication & AAC', description: 'Speech, language, and AAC.', icon: 'chat' },
  { value: 'functional_life_skills', label: 'Functional & Life Skills', description: 'Self-care and daily living.', icon: 'person' },
  { value: 'collaboration_planning', label: 'Collaboration & Planning', description: 'Staff coordination and families.', icon: 'group' },
];

export const SUB_AREA_OPTIONS: Record<string, SelectOption[]> = {
  instructional_support: [
    { value: 'literacy', label: 'Literacy', description: 'Reading, phonics, and print awareness' },
    { value: 'math', label: 'Mathematics', description: 'Number sense, operations, and problem-solving' },
    { value: 'comprehension', label: 'Comprehension', description: 'Understanding and retaining what is read or heard' },
    { value: 'writing', label: 'Writing', description: 'Forming letters, composing text, and expressing ideas' },
    { value: 'sensory_supports', label: 'Sensory Supports', description: 'Accommodations for sensory processing needs during instruction' },
    { value: 'motor_supports', label: 'Motor Supports', description: 'Adaptations for fine or gross motor challenges in learning tasks' },
    { value: 'other', label: 'Other' },
  ],
  behavior_support: [
    { value: 'positive_supports', label: 'Positive Behavior Supports', description: 'Proactive strategies that reinforce desired behaviors' },
    { value: 'self_regulation', label: 'Self-Regulation', description: 'Helping learners manage their own emotions and actions' },
    { value: 'replacement_behaviors', label: 'Replacement Behaviors', description: 'Teaching alternative behaviors to replace challenging ones' },
    { value: 'social_skills', label: 'Social Skills', description: 'Building skills for appropriate social interactions' },
    { value: 'peer_interaction', label: 'Peer Interaction', description: 'Supporting meaningful engagement with classmates' },
    { value: 'other', label: 'Other' },
  ],
  communication_aac: [
    { value: 'expressive', label: 'Expressive Communication', description: 'Helping learners express wants, needs, and ideas' },
    { value: 'receptive', label: 'Receptive Communication', description: 'Supporting understanding of spoken or signed language' },
    { value: 'aac', label: 'Augmentative & Alternative Communication (AAC)', description: 'Devices, apps, or systems that supplement speech' },
    { value: 'pragmatic', label: 'Social Communication', description: 'Using language appropriately in social contexts' },
    { value: 'other', label: 'Other' },
  ],
  functional_life_skills: [
    { value: 'self_care', label: 'Self-Care', description: 'Hygiene, dressing, and personal routines' },
    { value: 'meal_prep', label: 'Meal Preparation', description: 'Food handling, simple cooking, and kitchen safety' },
    { value: 'money_management', label: 'Money Management', description: 'Recognizing coins, making purchases, and budgeting basics' },
    { value: 'community_navigation', label: 'Getting Around the Community', description: 'Using transportation, reading signs, and staying safe in public' },
    { value: 'vocational', label: 'Vocational Skills', description: 'Task completion, following schedules, and workplace behavior' },
    { value: 'independent_living', label: 'Independent Living', description: 'Household tasks, safety awareness, and daily routines' },
    { value: 'other', label: 'Other' },
  ],
  collaboration_planning: [
    { value: 'team_coordination', label: 'Team Coordination', description: 'Aligning staff roles, schedules, and responsibilities' },
    { value: 'iep_implementation', label: 'IEP Implementation', description: 'Putting IEP goals and accommodations into daily practice' },
    { value: 'family_engagement', label: 'Family Engagement', description: 'Partnering with families to support learning at home and school' },
    { value: 'transition_planning', label: 'Transition Planning', description: 'Preparing students for moves between settings or post-school life' },
    { value: 'self_determination', label: 'Self-Determination', description: 'Teaching students to make choices, set goals, and advocate for themselves' },
    { value: 'other', label: 'Other' },
  ],
};

export const COMMUNICATION_LEVEL_OPTIONS: SelectOption[] = [
  { value: 'pre_symbolic', label: 'Pre-Symbolic', description: 'Communicates through body movements, facial expressions, or sounds' },
  { value: 'emerging_symbolic', label: 'Emerging Symbolic', description: 'Beginning to use gestures, pictures, or objects to communicate' },
  { value: 'symbolic', label: 'Symbolic', description: 'Uses symbols, signs, or words with consistent meaning' },
  { value: 'verbal_limited', label: 'Verbal (Limited)', description: 'Uses some words or short phrases' },
  { value: 'verbal_fluent', label: 'Verbal (Fluent)', description: 'Communicates in sentences with clear meaning' },
  { value: 'aac_user', label: 'Augmentative Communication (AAC) User', description: 'Uses augmentative/alternative communication devices or systems' },
  { value: 'other', label: 'Other' },
];

export const MOBILITY_LEVEL_OPTIONS: SelectOption[] = [
  { value: 'independent', label: 'Independent' },
  { value: 'assisted_walking', label: 'Assisted Walking', description: 'Uses a walker, crutches, or hand-over-hand support' },
  { value: 'wheelchair', label: 'Wheelchair User' },
  { value: 'limited_mobility', label: 'Limited Mobility', description: 'Needs significant physical support for movement' },
  { value: 'other', label: 'Other' },
];

export const SENSORY_OPTIONS: SelectOption[] = [
  { value: 'visual_impairment', label: 'Visual Impairment' },
  { value: 'hearing_impairment', label: 'Hearing Impairment' },
  { value: 'sensory_seeking', label: 'Sensory Seeking', description: 'Actively seeks out sensory input (movement, touch, sound)' },
  { value: 'sensory_avoiding', label: 'Sensory Avoiding', description: 'Sensitive to or withdraws from sensory input (noise, light, textures)' },
  { value: 'other', label: 'Other' },
];

export const BEHAVIORAL_OPTIONS: SelectOption[] = [
  { value: 'elopement', label: 'Elopement Risk', description: 'May leave designated areas without permission' },
  { value: 'self_injury', label: 'Self-Injurious Behavior', description: 'May engage in behaviors that could cause self-harm' },
  { value: 'aggression', label: 'Aggression Toward Others', description: 'May hit, kick, bite, or push others when distressed' },
  { value: 'non_compliance', label: 'Task Refusal', description: 'Difficulty following directions or completing requested tasks' },
  { value: 'attention', label: 'Attention Difficulties', description: 'Has trouble sustaining focus or is easily distracted' },
  { value: 'other', label: 'Other' },
];
