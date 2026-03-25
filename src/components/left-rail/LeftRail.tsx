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
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <LearnerPortrait />

        <div className="space-y-4">
          <GradeBandSelect />
          <SettingSelect />
          <GroupingSelect />
          <TimeSelect />
        </div>

        <SupportArea />
        <SubArea />

        <LearnerCharacteristics />
        <TechnologyContext />
        <OutputPreferences />
        <RolePerspective />
      </div>

      <div className="border-t border-neutral-200 bg-white p-4">
        <UpdateGuidanceButton />
      </div>
    </div>
  );
}
