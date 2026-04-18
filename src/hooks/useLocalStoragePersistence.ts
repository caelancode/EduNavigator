import { useEffect, useRef } from 'react';
import type { LeftRailState } from '../types/left-rail';

const STORAGE_KEY = 'edunavigator_settings_v1';

/** Serialize state for localStorage, stripping ephemeral/transient fields */
function toStorable(state: LeftRailState): string {
  const {
    wizardCompleted,
    wizardStepIndex,
    recentlyUpdatedFields,
    manuallySetFields,
    aiInferredFields,
    ...rest
  } = state;
  void wizardCompleted;
  void wizardStepIndex;
  void recentlyUpdatedFields;
  void manuallySetFields;
  void aiInferredFields;
  return JSON.stringify(rest);
}

export function hasSavedSettings(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

export function getSavedSettings(): LeftRailState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LeftRailState>;
    // Ensure new fields have defaults for backwards compat
    return {
      gradeBand: parsed.gradeBand ?? null,
      setting: parsed.setting ?? null,
      grouping: parsed.grouping ?? null,
      timeRange: parsed.timeRange ?? null,
      learnerCharacteristics: parsed.learnerCharacteristics ?? {
        communicationLevel: [],
        mobilityLevel: [],
        sensoryConsiderations: [],
        behavioralConsiderations: [],
      },
      techContext: parsed.techContext ?? null,
      supportArea: parsed.supportArea ?? null,
      subArea: parsed.subArea ?? null,
      outputPreference: parsed.outputPreference ?? null,
      rolePerspective: parsed.rolePerspective ?? null,
      stepNotes: parsed.stepNotes ?? {},
      contextNotes: parsed.contextNotes ?? '',
      wizardCompleted: false,
      wizardStepIndex: 0,
      recentlyUpdatedFields: new Set(),
      manuallySetFields: new Set(),
      aiInferredFields: new Set(),
    };
  } catch {
    return null;
  }
}

export function clearSavedSettings(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silent
  }
}

/** Auto-save Left Rail state to localStorage with 500ms debounce */
export function useAutoSaveSettings(state: LeftRailState): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const isNonEmpty =
      state.gradeBand !== null ||
      state.setting !== null ||
      state.supportArea !== null;

    if (!isNonEmpty) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, toStorable(state));
      } catch {
        // silent — localStorage may be full or unavailable
      }
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state]);
}
