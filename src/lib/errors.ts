export class AppError extends Error {
  readonly status: 400 | 401 | 403 | 404;

  constructor(status: 400 | 401 | 403 | 404, message: string) {
    super(message);
    this.name = "AppError";
    this.status = status;
  }
}

export function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === 11000
  );
}
