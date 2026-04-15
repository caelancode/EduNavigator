import { OwlAvatar } from './ChatMessage';
import { useGuidedIntake } from '../../hooks/useGuidedIntake';

/** Maps support area enum values to natural-language phrases and subtitles for the landing cards. */
const SUPPORT_AREA_CARDS: {
  value: string;
  label: string;
  subtitle: string;
}[] = [
  {
    value: 'instructional_support',
    label: 'Instruction & Learning',
    subtitle: 'Reading, math, comprehension, writing',
  },
  {
    value: 'behavior_support',
    label: 'Behavior Support',
    subtitle: 'Challenging behaviors, self-regulation, social skills',
  },
  {
    value: 'communication_aac',
    label: 'Communication & AAC',
    subtitle: 'Expressive/receptive language, AAC devices',
  },
  {
    value: 'functional_life_skills',
    label: 'Life Skills & Independence',
    subtitle: 'Self-care, community, vocational',
  },
  {
    value: 'collaboration_planning',
    label: 'Collaboration & Planning',
    subtitle: 'IEPs, team coordination, families, transitions',
  },
];

export function WelcomeMessage() {
  const { selectSupportArea } = useGuidedIntake();

  return (
    <div className="flex w-full animate-fade-in-up motion-reduce:animate-none justify-start">
      <div className="flex max-w-[95%] flex-row gap-3">
        {/* Avatar — gradient version */}
        <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 via-primary-50 to-accent-50 text-primary-600 shadow-card animate-scale-in motion-reduce:animate-none">
          <OwlAvatar className="h-5 w-5" />
        </div>

        {/* Landing card with question + support area cards */}
        <div className="min-w-0 rounded-2xl rounded-tl-md border border-primary-100/60 bg-gradient-to-br from-white via-white to-primary-50/30 px-5 py-5 shadow-card sm:px-7 sm:py-6">
          <h2 className="font-heading text-lg font-bold text-neutral-900">
            What are you working on with this student?
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Click a topic to get started, or describe your situation below.
          </p>

          {/* Support area cards grid */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            {SUPPORT_AREA_CARDS.map((card) => (
              <button
                key={card.value}
                type="button"
                onClick={() => selectSupportArea(card.value)}
                className="group flex flex-col items-start rounded-xl border border-neutral-200 bg-white px-3 py-3 text-left shadow-sm transition-all hover:border-primary-300 hover:bg-primary-50/50 hover:shadow-md active:scale-[0.98] motion-reduce:transform-none sm:px-4 sm:py-4"
              >
                <span className="text-sm font-semibold text-neutral-800 group-hover:text-primary-700">
                  {card.label}
                </span>
                <span className="mt-0.5 text-sm leading-snug text-neutral-500">
                  {card.subtitle}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
