import { LeftRailForm } from './LeftRailForm';

export function LeftRail() {
  return (
    <div className="flex h-full flex-col bg-panel-rail">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-neutral-100 px-5 py-4">
        <h2 className="font-heading text-sm font-bold tracking-tight text-neutral-800">
          Your Teaching Context
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Your inputs shape every strategy recommendation
        </p>
      </div>
      <LeftRailForm />
    </div>
  );
}
