export class ApiError extends Error {
  get outcome() {
    return this.statusCode === 504 ? "unknown" : "failed";
  }
  constructor(
    readonly statusCode: number,
    message: string,
    readonly retryAfter?: number,
  ) {
    super(message);
  }
}
