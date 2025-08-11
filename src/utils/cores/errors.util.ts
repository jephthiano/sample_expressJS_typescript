class ValidationError extends Error {
  public errors: unknown;

  constructor(errors: unknown) {
    super("Validation failed");
    this.name = "ValidationError";
    this.errors = errors; // array of { field, message }
    Error.captureStackTrace(this, this.constructor);
  }
}
  
  
  class CustomApiException extends Error {
    public status: number;
    public details: unknown;

    constructor(message: string, status:number = 400, details: unknown = {}) {
      super(message);
      this.name    = "CustomApiException";
      this.status  = status;
      this.details = details;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export { ValidationError, CustomApiException, };
  