import { cloneElement, type ReactNode, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage as ChatMessageType } from '../../types/chat';
import type { CitationLink } from '../../types/cross-reference';
import { CitationBadge } from './CitationBadge';
import { QuestionChips } from './QuestionChips';
import { SuggestionChips } from './SuggestionChips';
import { useCrossReference } from '../../contexts/CrossReferenceContext';
import { useSendMessage } from '../../hooks/useSendMessage';
import { useGuidedIntake } from '../../hooks/useGuidedIntake';

function OwlAvatar({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Geometric owl — clean lines, professional logo mark */}
      {/* Head outline */}
      <path
        d="M12 3L7 6.5C4.8 8.2 3.5 10.8 3.5 13.5 3.5 18.2 7.3 22 12 22s8.5-3.8 8.5-8.5c0-2.7-1.3-5.3-3.5-7L12 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Ear tufts */}
      <path d="M8 7L6.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 7L17.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Eyes — clean geometric circles */}
      <circle cx="9" cy="12.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="15" cy="12.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      {/* Pupils */}
      <circle cx="9.5" cy="12.5" r="1" fill="currentColor" />
      <circle cx="15.5" cy="12.5" r="1" fill="currentColor" />
      {/* Beak — small diamond */}
      <path d="M12 15.5l-1 1.5h2l-1-1.5z" fill="currentColor" />
    </svg>
  );
}

export { OwlAvatar };

/** Placeholder token that won't conflict with markdown */
const CITE_PLACEHOLDER = '%%CITE_';
const CITE_PATTERN = /\[(\d+)\]/g;
const PLACEHOLDER_PATTERN = /%%CITE_(\d+)%%/;

/**
 * Replace [N] citation markers with placeholder tokens before markdown parsing.
 * Only replaces citations where N is 1-9 (reasonable strategy range).
 */
function preprocessCitations(text: string): string {
  return text.replace(CITE_PATTERN, (_match, num) => {
    const n = parseInt(num, 10);
    if (n >= 1 && n <= 9) {
      return `${CITE_PLACEHOLDER}${n}%%`;
    }
    return _match;
  });
}

/**
 * Scans React children for placeholder tokens and replaces them with
 * CitationBadge components. Works recursively through nested children.
 */
function interpolateCitations(
  children: ReactNode,
  messageId: string,
  isActive: boolean,
  citations: CitationLink[] | undefined,
): ReactNode {
  if (typeof children === 'string') {
    const parts = children.split(PLACEHOLDER_PATTERN);
    if (parts.length === 1) return children;

    return parts.map((part, i) => {
      // Odd indices are the captured group (citation number)
      if (i % 2 === 1) {
        const num = parseInt(part, 10);
        // Look up the pre-computed global strategyIndex from the message's citation
        // data so the color/scroll target matches the correct workspace card even
        // when an offset was applied (i.e. strategies from a previous turn exist).
        const link = citations?.find((c) => c.citationNumber === num);
        const strategyIndex = link ? link.strategyIndex : num - 1;
        return (
          <CitationBadge
            key={`cite-${messageId}-${num}-${i}`}
            citationNumber={num}
            strategyIndex={strategyIndex}
            messageId={messageId}
            isActive={isActive}
          />
        );
      }
      return part || null;
    });
  }

  if (Array.isArray(children)) {
    return children.map((child, i) => {
      const result = interpolateCitations(child, messageId, isActive, citations);
      if (typeof result === 'string') return result;
      if (Array.isArray(result)) {
        return result.map((r, j) => {
          if (r && typeof r === 'object' && 'key' in r) return r;
          return <span key={`${i}-${j}`}>{r}</span>;
        });
      }
      return result;
    });
  }

  if (children && typeof children === 'object' && 'props' in children) {
    const element = children as React.ReactElement<{ children?: ReactNode }>;
    if (element.props.children) {
      const newChildren = interpolateCitations(
        element.props.children,
        messageId,
        isActive,
        citations,
      );
      // Only clone if children actually changed
      if (newChildren !== element.props.children) {
        return cloneElement(element, {}, newChildren);
      }
    }
  }

  return children;
}

interface ChatMessageProps {
  message: ChatMessageType;
  /** Whether a user message exists after this one (dims chips if true) */
  isAnswered?: boolean;
}

export function ChatMessage({ message, isAnswered = false }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const { strategyGeneration } = useCrossReference();
  const { send, isLoading } = useSendMessage();
  const intake = useGuidedIntake();

  const hasCitations =
    !isUser && message.citations && message.citations.length > 0;
  const isCitationActive =
    hasCitations && message.strategyGeneration === strategyGeneration;

  // Pre-process markdown to replace [N] with placeholders
  const processedContent = useMemo(() => {
    if (!hasCitations) return message.content;
    return preprocessCitations(message.content);
  }, [message.content, hasCitations]);

  // Custom markdown components that interpolate citation badges
  const markdownComponents = useMemo(() => {
    if (!hasCitations) return undefined;

    const wrapWithCitations = (children: ReactNode) =>
      interpolateCitations(children, message.id, isCitationActive ?? false, message.citations);

    return {
      p: ({ children }: { children?: ReactNode }) => (
        <p>{wrapWithCitations(children)}</p>
      ),
      li: ({ children }: { children?: ReactNode }) => (
        <li>{wrapWithCitations(children)}</li>
      ),
      strong: ({ children }: { children?: ReactNode }) => (
        <strong>{wrapWithCitations(children)}</strong>
      ),
      em: ({ children }: { children?: ReactNode }) => (
        <em>{wrapWithCitations(children)}</em>
      ),
    };
  }, [hasCitations, message.id, isCitationActive, message.citations]);

  return (
    <div
      className={`flex w-full flex-col animate-fade-in-up motion-reduce:animate-none ${isUser ? 'items-end' : 'items-start'}`}
    >
      <div
        className={`flex gap-3 ${isUser ? 'max-w-[85%] flex-row-reverse' : 'max-w-[80%] flex-row'}`}
      >
        {!isUser && (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 shadow-sm">
            <OwlAvatar className="h-7 w-7" />
          </div>
        )}
        <div
          className={`min-w-0 px-3.5 py-2 text-base font-medium leading-relaxed sm:px-4 sm:py-2.5 ${
            isUser
              ? 'rounded-2xl rounded-tr-md bg-chat-user text-neutral-800 shadow-sm'
              : 'rounded-2xl rounded-tl-md bg-chat-ai text-neutral-800'
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
          ) : (
            <div className="prose max-w-none prose-headings:mb-2 prose-headings:mt-3 prose-headings:font-bold prose-headings:text-neutral-800 prose-p:my-0 [&_p+p]:mt-2 prose-ul:my-3 prose-ol:my-3 prose-li:my-0.5">
              <ReactMarkdown components={markdownComponents}>
                {processedContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
      {/* Render question as a follow-up AI bubble with chips below */}
      {!isUser && message.nextQuestion && (
        <>
          {/* Only add a separate question bubble for AI-generated questions.
              Intake (isLocal) messages already use the message content as the question. */}
          {!message.nextQuestion.isLocal && (
            <div className="flex w-full flex-col animate-fade-in-up motion-reduce:animate-none items-start mt-3">
              <div className="flex gap-3 max-w-[80%] flex-row">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 shadow-sm">
                  <OwlAvatar className="h-7 w-7" />
                </div>
                <div className="min-w-0 px-3.5 py-2 text-base font-medium leading-relaxed sm:px-4 sm:py-2.5 rounded-2xl rounded-tl-md bg-chat-ai text-neutral-800">
                  {message.nextQuestion.text}
                </div>
              </div>
            </div>
          )}
          <div className="ml-12 mt-1">
            <QuestionChips
              question={message.nextQuestion}
              isAnswered={isAnswered}
              isLoading={isLoading}
              onSelect={(value, label) => {
                // Once intake is complete, always send chips as chat messages —
                // never re-trigger intake methods on old messages.
                if (intake.stage !== 'complete' && message.nextQuestion?.isLocal) {
                  if (message.nextQuestion.field === 'subArea') {
                    intake.selectSubArea(value);
                  } else if (message.nextQuestion.field === 'gradeBand') {
                    intake.selectGradeBand(value);
                  }
                } else {
                  send(label);
                }
              }}
            />
          </div>
        </>
      )}
      {/* Render suggestion chips after strategy-bearing responses */}
      {!isUser && message.suggestionChips && message.suggestionChips.length > 0 && (
        <div className="ml-12 mt-1">
          <SuggestionChips
            chips={message.suggestionChips}
            isAnswered={isAnswered}
            isLoading={isLoading}
            onSelect={(msg) => send(msg)}
          />
        </div>
      )}
      {/* Render action button (e.g., "Find Strategies") */}
      {!isUser && message.actionButton && !isAnswered && !isLoading && (
        <div className="ml-12 mt-3">
          <button
            type="button"
            onClick={() => intake.confirmAndSearch()}
            disabled={isLoading}
            className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 active:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {message.actionButton.label}
          </button>
        </div>
      )}
    </div>
  );
}
