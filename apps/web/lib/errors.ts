/** Error thrown when the backend answers with a non-2xx status. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body?: unknown
  ) {
    super(message)
    this.name = "ApiError"
  }
}

/**
 * A backend `4xx`: the request was understood and rejected (validation, conflict), so actions
 * return it as a value. Anything else, including Next's `redirect()`/`notFound()` signals, must be rethrown.
 */
export function isExpectedApiError(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status >= 400 && error.status < 500
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message
  return fallback
}
