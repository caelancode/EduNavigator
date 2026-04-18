import type { LeftRailState } from '../types/left-rail';
import type { ChatMessage } from '../types/chat';
import type { Strategy } from '../types/strategy';

export const MOCK_LEFT_RAIL_STATE: LeftRailState = {
  gradeBand: '3_5',
  setting: 'self_contained',
  grouping: 'small_group',
  timeRange: '21_30',
  learnerCharacteristics: {
    communicationLevel: ['verbal_limited', 'aac_user'],
    mobilityLevel: ['independent'],
    sensoryConsiderations: ['sensory_avoiding'],
    behavioralConsiderations: ['non_compliance'],
  },
  techContext: 'minimal_tech',
  supportArea: 'instructional_support',
  subArea: 'literacy',
  outputPreference: 'step_by_step',
  rolePerspective: 'special_educator',
  stepNotes: {},
  contextNotes: '',
  wizardCompleted: true,
  wizardStepIndex: 0,
  recentlyUpdatedFields: new Set(),
  manuallySetFields: new Set(),
  aiInferredFields: new Set(),
};

export const MOCK_CHAT_MESSAGES: Omit<ChatMessage, 'id' | 'timestamp'>[] = [
  {
    role: 'user',
    content:
      'How can I support literacy for my 3rd-5th grade students with significant cognitive disabilities in a small group setting?',
  },
  {
    role: 'assistant',
    content:
      "Great question! Literacy instruction for students with significant cognitive disabilities works best when it's multi-sensory, predictable, and built around meaningful, age-respectful texts.\n\nSince you're working with a small group of 3rd-5th graders in a self-contained classroom with about 20-30 minutes, I'd focus on **shared reading with adapted texts** combined with **systematic phonics using tactile supports**. Given that some of your students use AAC and others have limited verbal communication, embedding communication opportunities directly into literacy routines will be key.\n\nThe visual supports your students need can actually double as literacy scaffolds — think picture-symbol sentence strips, visual vocabulary walls, and predictable chart writing.\n\nFor the task avoidance you mentioned, embedding **choice-making** into the literacy block (e.g., \"Which book shall we read?\" or \"Pick a word to practice\") gives students agency and reduces avoidance behaviors.\n\nI've pulled three evidence-based strategies that fit your context well. Take a look at the workspace panel — each one includes implementation steps you can use right away. [1] [2] [3]",
    citations: [
      { citationNumber: 1, strategyIndex: 0, messageId: '' },
      { citationNumber: 2, strategyIndex: 1, messageId: '' },
      { citationNumber: 3, strategyIndex: 2, messageId: '' },
    ],
  },
];

export const MOCK_STRATEGIES: Strategy[] = [
  {
    title: 'Shared Reading with Adapted Texts',
    context_tagline: 'Works well for small-group literacy with students who use AAC.',
    quick_version:
      'Read an adapted picture-symbol book aloud to the group 3\u20134 times across the week. Pause at key moments and use AAC boards so every student can respond. Track who participates each session with a simple checklist.',
    steps: {
      prep: [
        'Select an age-appropriate text and create an adapted version with picture symbols alongside print.',
        'Prepare AAC boards or communication devices with vocabulary from the book.',
        'Print a participation checklist (attended, responded, turned page independently).',
      ],
      during: [
        'Introduce the book and do a brief picture walk.',
        'Read aloud, pausing at each key moment.',
        'Embed a communication opportunity at each pause \u2014 use AAC boards so every student can respond to \u201cWhat do you see?\u201d or \u201cWhat happens next?\u201d',
        'Re-read the same book 3\u20134 times across the week to build familiarity.',
      ],
      follow_up: [
        'Mark the participation checklist after each session.',
        'Add tactile elements to the book over time (textured covers, raised-line illustrations) to deepen engagement.',
      ],
    },
    why_fits:
      'Shared reading is one of the most well-supported literacy practices for students with significant cognitive disabilities. It provides repeated exposure to text in a predictable, supportive format that works well in small groups. Adapted texts with picture symbols align with your students\u2019 need for visual supports and AAC access, making participation accessible regardless of verbal ability.',
    supporting_excerpt:
      'Shared reading interventions using adapted texts with picture symbols have shown positive effects on literacy engagement, print awareness, and communication for students with significant cognitive disabilities across elementary grades.',
    source: {
      formatted:
        'Browder, D. M., Lee, A., & Mims, P. (2011). Using shared stories and individual response modes to promote comprehension and engagement in literacy for students with multiple disabilities. Education and Training in Autism and Developmental Disabilities, 46(3), 339-351.',
      authors: 'Browder, D. M., Lee, A., & Mims, P.',
      year: '2011',
      title:
        'Using shared stories and individual response modes to promote comprehension and engagement in literacy for students with multiple disabilities',
      publication:
        'Education and Training in Autism and Developmental Disabilities',
      location: '46(3), 339-351',
    },
    source_ref:
      'Browder, Lee, & Mims (2011). Education and Training in Autism and Developmental Disabilities, 46(3), 339-351.',
  },
  {
    title: 'Systematic Phonics with Tactile and Visual Supports',
    context_tagline:
      'Structured letter-sound practice using hands-on materials for students with limited verbal output.',
    quick_version:
      'Pick 2\u20133 letter-sounds per week from functional vocabulary. Pair each with a tactile letter card and picture keyword. Students trace the letter while producing the sound (or activating it on AAC). Review daily with a 5-minute card sort.',
    steps: {
      prep: [
        'Select 2\u20133 target letter-sounds based on functional vocabulary (e.g., letters in the student\u2019s name or high-frequency words).',
        'Prepare tactile letter cards (sandpaper or foam letters) paired with picture-symbol keyword cards.',
        'Set up a sound wall with mirrors so students can observe their own articulation.',
      ],
      during: [
        'Introduce each sound: model it, then have students trace the letter while producing the sound or activating it on their AAC device.',
        'Find the target letter in the current adapted shared reading text. Highlight it with a colored overlay.',
        'Provide a 5-minute daily review using a quick card-sort activity (match letter to picture keyword).',
      ],
      follow_up: [
        'Students add mastered sounds to a personal \u201csounds I know\u201d ring as a visual progress tracker.',
        'Graph mastery data weekly to identify letter-sounds ready for fading.',
      ],
    },
    why_fits:
      'Even students with significant cognitive disabilities benefit from systematic, explicit phonics instruction when it is paired with appropriate supports. Tactile letter cards and visual sound maps reduce reliance on verbal-only instruction, making this approach accessible for students who use AAC or have limited verbal output. The structured, repetitive nature also helps with task avoidance by providing clear expectations.',
    supporting_excerpt:
      'Systematic phonics instruction adapted with multi-sensory supports, including tactile letters and visual aids, has been associated with gains in letter-sound correspondence and early decoding skills for students with intellectual disabilities.',
    source: {
      formatted:
        'Allor, J. H., Mathes, P. G., Roberts, J. K., Cheatham, J. P., & Otaiba, S. A. (2014). Is scientifically based reading instruction effective for students with below-average IQs? Exceptional Children, 80(3), 287-306.',
      authors:
        'Allor, J. H., Mathes, P. G., Roberts, J. K., Cheatham, J. P., & Otaiba, S. A.',
      year: '2014',
      title:
        'Is scientifically based reading instruction effective for students with below-average IQs?',
      publication: 'Exceptional Children',
      location: '80(3), 287-306',
    },
    source_ref:
      'Allor, Mathes, Roberts, Cheatham, & Otaiba (2014). Exceptional Children, 80(3), 287-306.',
  },
  {
    title: 'Predictable Chart Writing',
    context_tagline:
      'Every student contributes to a shared text using a simple sentence frame \u2014 builds engagement and print awareness.',
    quick_version:
      'Write a sentence frame on chart paper connected to your current reading topic. Each student fills in the blank \u2014 verbally, with AAC, or with picture symbols. Read the completed chart together. Reuse it across the week for word-finding and copy-writing.',
    steps: {
      prep: [
        'Create a sentence frame on chart paper connected to your current shared reading topic (e.g., \u201cI like ___\u201d or \u201cThe character felt ___ because ___\u201d).',
        'Use a different color for the fill-in-the-blank portion.',
        'Prepare picture-symbol choice boards for students who need them.',
      ],
      during: [
        'Model completing the sentence yourself first, thinking aloud as you write.',
        'Each student contributes their own word or phrase \u2014 verbal students dictate, AAC users select from their device, others choose from picture-symbol boards.',
        'Write each student\u2019s response on the chart, reading the complete sentence aloud together after each addition.',
        'Re-read the entire chart as a group, pointing to each word. Students can take turns being the \u201cpointer.\u201d',
      ],
      follow_up: [
        'On subsequent days, use the chart for word-finding activities (\u201cFind the word *happy*\u201d), cut-up sentence rebuilding, or copy-writing practice.',
      ],
    },
    why_fits:
      'Predictable chart writing bridges reading and writing by using a simple sentence frame that students complete with their own ideas. It\u2019s ideal for small groups because every student contributes, creating a shared text the group can then read together. The repetitive sentence structure supports students with limited verbal skills or AAC users, and the choice element directly addresses task avoidance by increasing engagement and ownership.',
    supporting_excerpt:
      'Predictable chart writing provides a structured, interactive approach to emergent writing that supports comprehension, print concepts, and active participation for students with significant support needs in inclusive and self-contained settings.',
    source: {
      formatted:
        'Erickson, K. A., & Koppenhaver, D. A. (2020). Comprehensive Literacy for All: Teaching Students with Significant Disabilities to Read and Write. Brookes Publishing.',
      authors: 'Erickson, K. A., & Koppenhaver, D. A.',
      year: '2020',
      title:
        'Comprehensive Literacy for All: Teaching Students with Significant Disabilities to Read and Write',
      publication: 'Brookes Publishing',
    },
    source_ref:
      'Erickson & Koppenhaver (2020). Comprehensive Literacy for All. Brookes Publishing.',
  },
];
