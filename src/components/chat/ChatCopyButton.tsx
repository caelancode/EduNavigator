import { useState, useCallback } from 'react';

interface ChatCopyButtonProps {
  text: string;
}

export function ChatCopyButton({ text }: ChatCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may not be available
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`min-h-[32px] min-w-[44px] flex items-center gap-1 rounded px-2 text-xs transition-colors ${copied ? 'bg-success-50 text-success-800' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-700'}`}
      aria-label={copied ? 'Copied to clipboard' : 'Copy message'}
    >
      {copied ? (
        <>
          <svg className="h-3 w-3 animate-scale-in motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
          Copy
        </>
      )}
    </button>
  );
}
