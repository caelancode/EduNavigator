import { ErrorBanner } from '../ui';
import { getErrorDisplay } from '../../services/error-handler';
import type { ApiErrorCode } from '../../types/api';

interface WorkspaceErrorProps {
  code: ApiErrorCode;
  message: string;
  onDismiss?: () => void;
}

export function WorkspaceError({
  code,
  message,
  onDismiss,
}: WorkspaceErrorProps) {
  const display = getErrorDisplay(code);

  return (
    <div className="p-4">
      <ErrorBanner
        message={display?.message ?? message}
        onDismiss={onDismiss}
        onRetry={display?.showRetry ? onDismiss : undefined}
      />
    </div>
  );
}
