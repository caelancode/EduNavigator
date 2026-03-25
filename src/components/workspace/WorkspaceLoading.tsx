import { LoadingSpinner } from '../ui';

export function WorkspaceLoading() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="text-center">
        <LoadingSpinner label="Loading strategies..." size="lg" />
        <p className="mt-3 text-sm text-neutral-500">
          Finding evidence-based strategies...
        </p>
      </div>
    </div>
  );
}
