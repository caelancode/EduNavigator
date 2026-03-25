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
      className="text-xs text-neutral-400 hover:text-neutral-600"
      aria-label={copied ? 'Copied to clipboard' : 'Copy message'}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
