/**
 * Standard Application Error Model (Document 02 §14, Document 03 §27)
 * Never exposes stack traces or internal secrets to user-facing responses.
 */

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    code: ErrorCode,
    message: string,
    options: { status?: number; isOperational?: boolean; details?: unknown } = {}
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = options.status ?? defaultStatusCode(code);
    this.isOperational = options.isOperational ?? true;
    this.details = options.details;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super("VALIDATION_ERROR", message, { status: 400, details });
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Unauthorized administrative access.") {
    super("UNAUTHORIZED", message, { status: 401 });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Administrative privilege forbidden.") {
    super("FORBIDDEN", message, { status: 403 });
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Requested entity could not be found.") {
    super("NOT_FOUND", message, { status: 404 });
  }
}

export class ConflictError extends AppError {
  constructor(message = "Entity conflict occurred.") {
    super("CONFLICT", message, { status: 409 });
  }
}

function defaultStatusCode(code: ErrorCode): number {
  switch (code) {
    case "VALIDATION_ERROR":
      return 400;
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "CONFLICT":
      return 409;
    case "RATE_LIMITED":
      return 429;
    case "INTERNAL_ERROR":
    default:
      return 500;
  }
}

export function toSafeUserMessage(error: unknown): string {
  if (error instanceof AppError && error.isOperational) {
    return error.message;
  }
  return "An unexpected error occurred. Please try again later.";
}
