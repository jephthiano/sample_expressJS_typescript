class ValidationError extends Error {
  public errors: { field: string; message: string }[];

  constructor(errors: { field: string; message: string }[]) {
    super("Validation failed");
    this.name = "ValidationError";
    this.errors = errors; // array of { field, message }
    Error.captureStackTrace(this, this.constructor);
  }
}
  
  
  class CustomApiException extends Error {
    constructor(message: string, status = 400, details: {} = {}) {
      super(message);
      this.name    = "CustomApiException";
      this.status  = status;
      this.details = details;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export { ValidationError, CustomApiException, };
  