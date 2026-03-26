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
      className="min-h-[44px] min-w-[44px] rounded px-2 text-xs text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
      aria-label={copied ? 'Copied to clipboard' : 'Copy message'}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
