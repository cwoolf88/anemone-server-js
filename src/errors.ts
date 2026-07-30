export class AnemoneError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status?: number,
    readonly body?: unknown
  ) {
    super(message);
    this.name = "AnemoneError";
  }
}

export class WebhookVerificationError extends AnemoneError {
  constructor(message: string, code: string = "WEBHOOK_VERIFICATION_FAILED") {
    super(message, code);
    this.name = "WebhookVerificationError";
  }
}
