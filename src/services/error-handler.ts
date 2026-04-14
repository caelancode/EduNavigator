import type { ApiErrorCode } from '../types/api';

interface ErrorDisplay {
  title: string;
  message: string;
  showRetry: boolean;
}

const ERROR_DISPLAY: Record<ApiErrorCode, ErrorDisplay> = {
  network_error: {
    title: 'Connection Issue',
    message:
      "We're having trouble connecting. Check your internet and try again.",
    showRetry: true,
  },
  timeout: {
    title: 'Request Timed Out',
    message:
      'This is taking longer than usual. Try again in a moment.',
    showRetry: true,
  },
  missing_delimiter: {
    title: 'Strategies Unavailable',
    message:
      "I got a response but couldn't pull out the strategies. Try sending your message again.",
    showRetry: false,
  },
  invalid_json: {
    title: 'Parsing Error',
    message: 'Something went wrong reading the strategies. Try again.',
    showRetry: true,
  },
  not_array: {
    title: 'Unexpected Format',
    message: 'The strategies came back in an unexpected format. Try again.',
    showRetry: true,
  },
  schema_violation: {
    title: 'Partial Results',
    message:
      "Some strategies didn't check out. Showing what I could verify.",
    showRetry: false,
  },
  no_valid_strategies: {
    title: 'No Matching Strategies',
    message:
      "I couldn't find strategies for this exact combination. Try adjusting your settings or describing your situation differently in chat.",
    showRetry: false,
  },
  empty_response: {
    title: 'No Response',
    message: "Didn't hear back from the server. Try again.",
    showRetry: true,
  },
  rate_limited: {
    title: 'Please Wait',
    message:
      "You're moving fast! Give it a moment and try again.",
    showRetry: true,
  },
};

export function getErrorDisplay(code: ApiErrorCode): ErrorDisplay {
  return ERROR_DISPLAY[code];
}
