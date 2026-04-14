import { useState, useEffect, useCallback } from 'react';
import { useLeftRail } from '../../contexts/LeftRailContext';
import { useChat } from '../../contexts/ChatContext';
import { MultiSelect } from '../ui';
import { AccordionField } from './AccordionField';
import { OtherTextInput } from './OtherTextInput';
import { GradeBandSelect } from './GradeBandSelect';
import { SettingSelect } from './SettingSelect';
import { GroupingSelect } from './GroupingSelect';
import { TimeSelect } from './TimeSelect';
import { SupportArea } from './SupportArea';
import { SubArea } from './SubArea';
import { OutputPreferences } from './OutputPreferences';
import { RolePerspective } from './RolePerspective';
import { TechnologyContext } from './TechnologyContext';
import { UpdateGuidanceButton } from './UpdateGuidanceButton';
import {
  SUPPORT_AREA_OPTIONS,
  SUB_AREA_OPTIONS,
  COMMUNICATION_LEVEL_OPTIONS,
  MOBILITY_LEVEL_OPTIONS,
  SENSORY_OPTIONS,
  BEHAVIORAL_OPTIONS,
} from '../../constants/left-rail-options';
import { VALUE_LABELS } from '../../constants/system-prompt';
/** Label + spacing wrapper for fields inside section cards */
function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5">
        <span className="font-heading text-sm font-semibold text-neutral-700">{label}</span>
      </div>
      {children}
    </div>
  );
}

/** A collapsible section card for the wide layout */
function SectionCard({
  title,
  stepNumber,
  isOpen,
  onToggle,
  required,
  children,
}: {
  title: string;
  stepNumber: number;
  isOpen: boolean;
  onToggle: () => void;
  required?: boolean;
  children: React.ReactNode;
}) {
  const headerId = `section-header-${stepNumber}`;
  const bodyId = `section-body-${stepNumber}`;

  return (
    <div className="rounded-xl border border-neutral-200/70 bg-surface-50 shadow-card">
      <button
        id={headerId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={bodyId}
        className="group flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-colors hover:bg-neutral-50/60"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
          {stepNumber}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="font-heading text-sm font-semibold text-neutral-800 group-hover:text-neutral-900">
              {title}
            </span>
            {required && (
              <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700 ring-1 ring-inset ring-red-200">
                Required
              </span>
            )}
          </span>
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-neutral-600 transition-transform duration-200 motion-reduce:transition-none group-hover:text-neutral-700 ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        id={bodyId}
        role="region"
        aria-labelledby={headerId}
        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="space-y-5 px-4 pb-5 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function LeftRailForm() {
  const { state, dispatch } = useLeftRail();
  const { state: chatState } = useChat();
  // Always use compact (accordion) layout — the left rail is now a context mirror, not the primary input
  const compact = true;
  void chatState;
  const [openField, setOpenField] = useState<string | null>('supportArea');
  const [openSection, setOpenSection] = useState<string | null>('support');

  const toggle = useCallback(
    (id: string) => setOpenField((prev) => (prev === id ? null : id)),
    [],
  );

  const toggleSection = useCallback(
    (id: string) => setOpenSection((prev) => (prev === id ? null : id)),
    [],
  );

  const close = useCallback(() => setOpenField(null), []);

  const showSubArea =
    state.supportArea !== null &&
    SUB_AREA_OPTIONS[state.supportArea] !== undefined;

  const supportLabel = SUPPORT_AREA_OPTIONS.find((o) => o.value === state.supportArea)?.label ?? 'Support Area';

  /** Close current field on selection — user chooses what to open next */
  const handleSelect = useCallback(() => {
    setOpenField(null);
  }, []);

  // Close all sections when conversation starts (wide → compact transition)
  useEffect(() => {
    if (compact) {
      setOpenField(null);
      setOpenSection(null);
    }
  }, [compact]);

  // Section completion for progress indicator
  const supportDone = state.supportArea !== null;
  const contextDone = state.gradeBand !== null || state.setting !== null || state.grouping !== null || state.timeRange !== null;
  const learnerDone = state.learnerCharacteristics.communicationLevel.length > 0
    || state.learnerCharacteristics.mobilityLevel.length > 0
    || state.learnerCharacteristics.sensoryConsiderations.length > 0
    || state.learnerCharacteristics.behavioralConsiderations.length > 0;
  const prefsDone = state.techContext !== null || state.outputPreference !== null || state.rolePerspective !== null;
  const sectionsCompleted = [supportDone, contextDone, learnerDone, prefsDone].filter(Boolean).length;

  /* ------------------------------------------------------------------ */
  /*  WIDE LAYOUT — 4 collapsible section cards with progress indicator */
  /* ------------------------------------------------------------------ */
  if (!compact) {
    return (
      <>
        <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pb-8 pt-4">
          {/* Progress indicator */}
          <div className="mb-5 flex items-center gap-2">
            {[supportDone, contextDone, learnerDone, prefsDone].map((done, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${done ? 'bg-primary-500' : 'bg-neutral-200'}`}
              />
            ))}
            <span className="ml-1 text-xs font-medium text-neutral-700">
              {sectionsCompleted}/4
            </span>
          </div>

          <div className="space-y-3.5">
            {/* ── 1. Support Focus ── */}
            <SectionCard
              title="Support Focus"
              stepNumber={1}
              required
              isOpen={openSection === 'support'}
              onToggle={() => toggleSection('support')}
            >
              <FieldBlock
                label="What is your primary support focus?"
              >
                <SupportArea srOnlyLegend />
              </FieldBlock>

              {showSubArea && (
                <FieldBlock
                  label={`Focus Within ${supportLabel}`}
                >
                  <SubArea srOnlyLegend />
                  {state.subArea === 'other' && (
                    <div className="mt-2">
                      <OtherTextInput stepId="subArea" />
                    </div>
                  )}
                </FieldBlock>
              )}
            </SectionCard>

            {/* ── 2. Student Context ── */}
            <SectionCard
              title="Student Context"
              stepNumber={2}
              isOpen={openSection === 'context'}
              onToggle={() => toggleSection('context')}
            >
              <FieldBlock
                label="Grade or Age Band"
              >
                <GradeBandSelect srOnlyLegend />
              </FieldBlock>

              <FieldBlock
                label="Setting"
              >
                <SettingSelect srOnlyLegend />
                {state.setting === 'other' && (
                  <div className="mt-2">
                    <OtherTextInput stepId="setting" />
                  </div>
                )}
              </FieldBlock>

              <FieldBlock
                label="Grouping"
              >
                <GroupingSelect srOnlyLegend />
              </FieldBlock>

              <FieldBlock
                label="How Much Time?"
              >
                <TimeSelect srOnlyLegend />
              </FieldBlock>
            </SectionCard>

            {/* ── 3. Learner Characteristics ── */}
            <SectionCard
              title="Learner Characteristics"
              stepNumber={3}
              isOpen={openSection === 'learner'}
              onToggle={() => toggleSection('learner')}
            >
              <div className="space-y-2.5">
                <MultiSelect
                  legend="How They Communicate"
                  collapsible
                  options={COMMUNICATION_LEVEL_OPTIONS}
                  selectedValues={state.learnerCharacteristics.communicationLevel}
                  onChange={(values) =>
                    dispatch({
                      type: 'SET_LEARNER_CHARACTERISTICS',
                      payload: { communicationLevel: values },
                    })
                  }
                />
                {state.learnerCharacteristics.communicationLevel.includes('other') && (
                  <OtherTextInput stepId="communicationLevel" />
                )}

                <MultiSelect
                  legend="How They Move"
                  collapsible
                  options={MOBILITY_LEVEL_OPTIONS}
                  selectedValues={state.learnerCharacteristics.mobilityLevel}
                  onChange={(values) =>
                    dispatch({
                      type: 'SET_LEARNER_CHARACTERISTICS',
                      payload: { mobilityLevel: values },
                    })
                  }
                />
                {state.learnerCharacteristics.mobilityLevel.includes('other') && (
                  <OtherTextInput stepId="mobilityLevel" />
                )}

                <MultiSelect
                  legend="Sensory Needs"
                  collapsible
                  options={SENSORY_OPTIONS}
                  selectedValues={state.learnerCharacteristics.sensoryConsiderations}
                  onChange={(values) =>
                    dispatch({
                      type: 'SET_LEARNER_CHARACTERISTICS',
                      payload: { sensoryConsiderations: values },
                    })
                  }
                />
                {state.learnerCharacteristics.sensoryConsiderations.includes('other') && (
                  <OtherTextInput stepId="sensoryConsiderations" />
                )}

                <MultiSelect
                  legend="Behavioral Needs"
                  collapsible
                  options={BEHAVIORAL_OPTIONS}
                  selectedValues={state.learnerCharacteristics.behavioralConsiderations}
                  onChange={(values) =>
                    dispatch({
                      type: 'SET_LEARNER_CHARACTERISTICS',
                      payload: { behavioralConsiderations: values },
                    })
                  }
                />
                {state.learnerCharacteristics.behavioralConsiderations.includes('other') && (
                  <OtherTextInput stepId="behavioralConsiderations" />
                )}
              </div>
            </SectionCard>

            {/* ── 4. Preferences ── */}
            <SectionCard
              title="Preferences"
              stepNumber={4}
              isOpen={openSection === 'prefs'}
              onToggle={() => toggleSection('prefs')}
            >
              <FieldBlock
                label="Available Technology"
              >
                <TechnologyContext srOnlyLegend />
              </FieldBlock>

              <FieldBlock
                label="Strategy Format"
              >
                <OutputPreferences srOnlyLegend />
              </FieldBlock>

              <FieldBlock
                label="Your Role"
              >
                <RolePerspective srOnlyLegend />
                {state.rolePerspective === 'other' && (
                  <div className="mt-2">
                    <OtherTextInput stepId="rolePerspective" />
                  </div>
                )}
              </FieldBlock>
            </SectionCard>
          </div>
        </div>
      </>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  COMPACT LAYOUT — accordion (existing behavior)                    */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <div data-scroll-container="left-rail" className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4 pt-1">
        {/* Support focus */}
        <AccordionField
          id="supportArea"
          label="What is your primary support focus?"
          required
          isOpen={openField === 'supportArea'}
          onToggle={() => toggle('supportArea')}
          currentValue={state.supportArea ? (VALUE_LABELS[state.supportArea] ?? state.supportArea) : undefined}
          isHighlighted={state.recentlyUpdatedFields.has('supportArea')}
          isInferred={state.aiInferredFields.has('supportArea')}
        >
          <SupportArea srOnlyLegend onSelect={handleSelect} />
        </AccordionField>

        {showSubArea && (
          <AccordionField
            id="subArea"
            label={`Focus Within ${supportLabel}`}
            isOpen={openField === 'subArea'}
            onToggle={() => toggle('subArea')}
            currentValue={state.subArea ? (VALUE_LABELS[state.subArea] ?? state.subArea) : undefined}
            isHighlighted={state.recentlyUpdatedFields.has('subArea')}
            isInferred={state.aiInferredFields.has('subArea')}
            otherInput={
              state.subArea === 'other' ? (
                <OtherTextInput stepId="subArea" onBlur={close} />
              ) : undefined
            }
          >
            <SubArea srOnlyLegend onSelect={handleSelect} />
          </AccordionField>
        )}

        {/* Student context */}
        <AccordionField
          id="gradeBand"
          label="Grade or Age Band"
          isOpen={openField === 'gradeBand'}
          onToggle={() => toggle('gradeBand')}
          currentValue={state.gradeBand ? (VALUE_LABELS[state.gradeBand] ?? state.gradeBand) : undefined}
          isHighlighted={state.recentlyUpdatedFields.has('gradeBand')}
          isInferred={state.aiInferredFields.has('gradeBand')}
        >
          <GradeBandSelect srOnlyLegend onSelect={handleSelect} />
        </AccordionField>

        <AccordionField
          id="setting"
          label="Setting"
          isOpen={openField === 'setting'}
          onToggle={() => toggle('setting')}
          currentValue={state.setting ? (VALUE_LABELS[state.setting] ?? state.setting) : undefined}
          otherInput={
            state.setting === 'other' ? (
              <OtherTextInput stepId="setting" onBlur={close} />
            ) : undefined
          }
        >
          <SettingSelect srOnlyLegend onSelect={handleSelect} />
        </AccordionField>

        <AccordionField
          id="grouping"
          label="Grouping"
          isOpen={openField === 'grouping'}
          currentValue={state.grouping ? (VALUE_LABELS[state.grouping] ?? state.grouping) : undefined}
          onToggle={() => toggle('grouping')}
        >
          <GroupingSelect srOnlyLegend onSelect={handleSelect} />
        </AccordionField>

        <AccordionField
          id="timeRange"
          label="How Much Time?"
          isOpen={openField === 'timeRange'}
          onToggle={() => toggle('timeRange')}
          currentValue={state.timeRange ? (VALUE_LABELS[state.timeRange] ?? state.timeRange) : undefined}
        >
          <TimeSelect srOnlyLegend onSelect={handleSelect} />
        </AccordionField>

        {/* Learner characteristics — collapsible sub-sections */}
        <AccordionField
          id="learnerCharacteristics"
          label="Learner Characteristics"
          isOpen={openField === 'learnerCharacteristics'}
          onToggle={() => toggle('learnerCharacteristics')}
          currentValue={(() => {
            const allOptions = [
              ...COMMUNICATION_LEVEL_OPTIONS,
              ...MOBILITY_LEVEL_OPTIONS,
              ...SENSORY_OPTIONS,
              ...BEHAVIORAL_OPTIONS,
            ];
            const all = [
              ...state.learnerCharacteristics.communicationLevel,
              ...state.learnerCharacteristics.mobilityLevel,
              ...state.learnerCharacteristics.sensoryConsiderations,
              ...state.learnerCharacteristics.behavioralConsiderations,
            ];
            if (all.length === 0) return undefined;
            return all
              .map((v) => allOptions.find((o) => o.value === v)?.label ?? v)
              .join(', ');
          })()}
        >
          <div className="space-y-2">
            <MultiSelect
              legend="How They Communicate"
              collapsible
              options={COMMUNICATION_LEVEL_OPTIONS}
              selectedValues={state.learnerCharacteristics.communicationLevel}
              onChange={(values) =>
                dispatch({
                  type: 'SET_LEARNER_CHARACTERISTICS',
                  payload: { communicationLevel: values },
                })
              }
            />
            {state.learnerCharacteristics.communicationLevel.includes('other') && (
              <OtherTextInput stepId="communicationLevel" onBlur={close} />
            )}

            <MultiSelect
              legend="How They Move"
              collapsible
              options={MOBILITY_LEVEL_OPTIONS}
              selectedValues={state.learnerCharacteristics.mobilityLevel}
              onChange={(values) =>
                dispatch({
                  type: 'SET_LEARNER_CHARACTERISTICS',
                  payload: { mobilityLevel: values },
                })
              }
            />
            {state.learnerCharacteristics.mobilityLevel.includes('other') && (
              <OtherTextInput stepId="mobilityLevel" onBlur={close} />
            )}

            <MultiSelect
              legend="Sensory Needs"
              collapsible
              options={SENSORY_OPTIONS}
              selectedValues={state.learnerCharacteristics.sensoryConsiderations}
              onChange={(values) =>
                dispatch({
                  type: 'SET_LEARNER_CHARACTERISTICS',
                  payload: { sensoryConsiderations: values },
                })
              }
            />
            {state.learnerCharacteristics.sensoryConsiderations.includes('other') && (
              <OtherTextInput stepId="sensoryConsiderations" onBlur={close} />
            )}

            <MultiSelect
              legend="Behavioral Needs"
              collapsible
              options={BEHAVIORAL_OPTIONS}
              selectedValues={state.learnerCharacteristics.behavioralConsiderations}
              onChange={(values) =>
                dispatch({
                  type: 'SET_LEARNER_CHARACTERISTICS',
                  payload: { behavioralConsiderations: values },
                })
              }
            />
            {state.learnerCharacteristics.behavioralConsiderations.includes('other') && (
              <OtherTextInput stepId="behavioralConsiderations" onBlur={close} />
            )}
          </div>
        </AccordionField>

        {/* Preferences */}
        <AccordionField
          id="techContext"
          label="Available Technology"
          isOpen={openField === 'techContext'}
          onToggle={() => toggle('techContext')}
          currentValue={state.techContext ? (VALUE_LABELS[state.techContext] ?? state.techContext) : undefined}
        >
          <TechnologyContext srOnlyLegend onSelect={handleSelect} />
        </AccordionField>

        <AccordionField
          id="outputPreference"
          label="Strategy Format"
          isOpen={openField === 'outputPreference'}
          onToggle={() => toggle('outputPreference')}
          currentValue={state.outputPreference ? (VALUE_LABELS[state.outputPreference] ?? state.outputPreference) : undefined}
        >
          <OutputPreferences srOnlyLegend onSelect={handleSelect} />
        </AccordionField>

        <AccordionField
          id="rolePerspective"
          label="Your Role"
          isOpen={openField === 'rolePerspective'}
          onToggle={() => toggle('rolePerspective')}
          currentValue={state.rolePerspective ? (VALUE_LABELS[state.rolePerspective] ?? state.rolePerspective) : undefined}
          otherInput={
            state.rolePerspective === 'other' ? (
              <OtherTextInput stepId="rolePerspective" onBlur={close} />
            ) : undefined
          }
        >
          <RolePerspective srOnlyLegend onSelect={handleSelect} />
        </AccordionField>
      </div>

      <UpdateGuidanceButton />
    </>
  );
}
