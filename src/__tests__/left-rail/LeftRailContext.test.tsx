import { describe, it, expect } from 'vitest';
import {
  leftRailReducer,
  initialLeftRailState,
} from '../../contexts/LeftRailContext';

describe('leftRailReducer', () => {
  it('sets grade band', () => {
    const state = leftRailReducer(initialLeftRailState, {
      type: 'SET_GRADE_BAND',
      payload: '3_5',
    });
    expect(state.gradeBand).toBe('3_5');
  });

  it('sets setting', () => {
    const state = leftRailReducer(initialLeftRailState, {
      type: 'SET_SETTING',
      payload: 'resource_room',
    });
    expect(state.setting).toBe('resource_room');
  });

  it('sets grouping', () => {
    const state = leftRailReducer(initialLeftRailState, {
      type: 'SET_GROUPING',
      payload: 'small_group',
    });
    expect(state.grouping).toBe('small_group');
  });

  it('sets time range', () => {
    const state = leftRailReducer(initialLeftRailState, {
      type: 'SET_TIME_RANGE',
      payload: '21_30',
    });
    expect(state.timeRange).toBe('21_30');
  });

  it('merges learner characteristics', () => {
    const state = leftRailReducer(initialLeftRailState, {
      type: 'SET_LEARNER_CHARACTERISTICS',
      payload: { communicationLevel: ['verbal_limited'] },
    });
    expect(state.learnerCharacteristics.communicationLevel).toEqual([
      'verbal_limited',
    ]);
    expect(state.learnerCharacteristics.mobilityLevel).toEqual([]);
  });

  it('sets tech context', () => {
    const state = leftRailReducer(initialLeftRailState, {
      type: 'SET_TECH_CONTEXT',
      payload: 'specialized_tech',
    });
    expect(state.techContext).toBe('specialized_tech');
  });

  it('sets support area and clears sub area', () => {
    const initial = { ...initialLeftRailState, subArea: 'old_sub' };
    const state = leftRailReducer(initial, {
      type: 'SET_SUPPORT_AREA',
      payload: 'instructional_support',
    });
    expect(state.supportArea).toBe('instructional_support');
    expect(state.subArea).toBeNull();
  });

  it('sets sub area', () => {
    const state = leftRailReducer(initialLeftRailState, {
      type: 'SET_SUB_AREA',
      payload: 'phonics',
    });
    expect(state.subArea).toBe('phonics');
  });

  it('sets output preference', () => {
    const state = leftRailReducer(initialLeftRailState, {
      type: 'SET_OUTPUT_PREFERENCE',
      payload: 'step_by_step',
    });
    expect(state.outputPreference).toBe('step_by_step');
  });

  it('sets role perspective', () => {
    const state = leftRailReducer(initialLeftRailState, {
      type: 'SET_ROLE_PERSPECTIVE',
      payload: 'special_educator',
    });
    expect(state.rolePerspective).toBe('special_educator');
  });

  it('resets to initial state', () => {
    const modified = {
      ...initialLeftRailState,
      gradeBand: '3_5' as const,
      setting: 'home' as const,
      supportArea: 'behavior_support',
    };
    const state = leftRailReducer(modified, { type: 'RESET' });
    expect(state).toEqual(initialLeftRailState);
  });
});
