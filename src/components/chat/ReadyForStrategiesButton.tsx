import { useCallback } from 'react';
import { useCrossReference } from '../../contexts/CrossReferenceContext';
import { useSendMessage } from '../../hooks/useSendMessage';

export function ReadyForStrategiesButton() {
  const { phase } = useCrossReference();
  const { send, isLoading } = useSendMessage();

  const handleClick = useCallback(() => {
    if (isLoading) return;
    send('I\'m ready for strategy recommendations.');
  }, [send, isLoading]);

  if (phase !== 'elaboration') {
    return null;
  }

  return (
    <div className="flex justify-start px-5 pb-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
      >
        I&rsquo;m ready for strategies
      </button>
    </div>
  );
}
