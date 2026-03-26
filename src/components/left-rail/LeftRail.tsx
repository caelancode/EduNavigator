import { LearnerPortrait } from './LearnerPortrait';
import { GradeBandSelect } from './GradeBandSelect';
import { SettingSelect } from './SettingSelect';
import { GroupingSelect } from './GroupingSelect';
import { TimeSelect } from './TimeSelect';
import { LearnerCharacteristics } from './LearnerCharacteristics';
import { TechnologyContext } from './TechnologyContext';
import { SupportArea } from './SupportArea';
import { SubArea } from './SubArea';
import { OutputPreferences } from './OutputPreferences';
import { RolePerspective } from './RolePerspective';
import { UpdateGuidanceButton } from './UpdateGuidanceButton';

export function LeftRail() {
  return (
    <div className="flex h-full flex-col bg-rail">
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="mb-8 flex items-center gap-2.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-primary-600"
            aria-hidden="true"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <h2 className="text-lg font-semibold tracking-tight text-neutral-800">
            Build Your Learner Portrait
          </h2>
        </div>

        <LearnerPortrait />

        <div className="mt-6 flex flex-col gap-6">
          <GradeBandSelect />
          <SettingSelect />
          <GroupingSelect />
          <TimeSelect />
          <SupportArea />
          <SubArea />
        </div>

        <div className="mt-2">
          <LearnerCharacteristics />
          <TechnologyContext />
          <OutputPreferences />
          <RolePerspective />
        </div>
      </div>

      <div className="border-t border-neutral-200 bg-rail p-6">
        <UpdateGuidanceButton />
      </div>
    </div>
  );
}
