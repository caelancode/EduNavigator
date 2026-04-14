import { useRef, useEffect } from 'react';
import { useLeftRail } from '../../contexts/LeftRailContext';

interface OtherTextInputProps {
  stepId: string;
  onBlur?: () => void;
}

export function OtherTextInput({ stepId, onBlur }: OtherTextInputProps) {
  const { state, dispatch } = useLeftRail();
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const noteValue = state.stepNotes[stepId] ?? '';

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleBlur = (e: React.FocusEvent) => {
    // Don't close if focus is moving to another element inside this container
    if (
      containerRef.current &&
      e.relatedTarget instanceof Node &&
      containerRef.current.contains(e.relatedTarget)
    ) {
      return;
    }
    onBlur?.();
  };

  return (
    <div ref={containerRef} className="mt-3" onBlur={handleBlur}>
      <label
        htmlFor={`other-note-${stepId}`}
        className="block text-xs font-medium text-neutral-600 mb-1.5"
      >
        Could you describe?
      </label>
      <textarea
        id={`other-note-${stepId}`}
        ref={textareaRef}
        className="w-full resize-none rounded-lg border border-neutral-200 bg-surface-50 px-3 py-2 text-sm text-neutral-700 shadow-card placeholder:text-neutral-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        placeholder="Describe what you're looking for..."
        rows={2}
        maxLength={500}
        value={noteValue}
        onChange={(e) =>
          dispatch({
            type: 'SET_STEP_NOTE',
            payload: { stepId, note: e.target.value },
          })
        }
      />
    </div>
  );
}
