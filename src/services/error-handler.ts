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
      'Unable to reach the server. Please check your connection and try again.',
    showRetry: true,
  },
  timeout: {
    title: 'Request Timed Out',
    message:
      'The request is taking longer than expected. Please try again.',
    showRetry: true,
  },
  missing_delimiter: {
    title: 'Strategies Unavailable',
    message:
      'We received a response but could not extract strategy recommendations.',
    showRetry: false,
  },
  invalid_json: {
    title: 'Parsing Error',
    message: 'Could not process the strategy data. Please try again.',
    showRetry: true,
  },
  not_array: {
    title: 'Unexpected Format',
    message: 'The strategy data was not in the expected format.',
    showRetry: true,
  },
  schema_violation: {
    title: 'Partial Results',
    message:
      'Some strategies could not be validated. Showing available results.',
    showRetry: false,
  },
  no_valid_strategies: {
    title: 'No Matching Strategies',
    message:
      'No strategies matched your current context. Try adjusting your selections.',
    showRetry: false,
  },
  empty_response: {
    title: 'No Response',
    message: 'No response was received from the server. Please try again.',
    showRetry: true,
  },
  rate_limited: {
    title: 'Please Wait',
    message:
      'Too many requests. Please wait a moment before trying again.',
    showRetry: true,
  },
};

export function getErrorDisplay(code: ApiErrorCode): ErrorDisplay {
  return ERROR_DISPLAY[code];
}
