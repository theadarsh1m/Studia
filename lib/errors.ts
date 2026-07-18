export enum ErrorType {
  CONNECTION = "CONNECTION",
  TIMEOUT = "TIMEOUT",
  RATE_LIMIT = "RATE_LIMIT",
  PARSE = "PARSE",
  VALIDATION = "VALIDATION",
  EMPTY_RESPONSE = "EMPTY_RESPONSE",
  CONFIGURATION = "CONFIGURATION",
  UNKNOWN = "UNKNOWN",
}

export class StudyError extends Error {
  public type: ErrorType;
  public userMessage: string;
  public details?: string;

  constructor(type: ErrorType, message: string, userMessage: string, details?: string) {
    super(message);
    this.name = "StudyError";
    this.type = type;
    this.userMessage = userMessage;
    this.details = details;
    Object.setPrototypeOf(this, StudyError.prototype);
  }

  static connection(): StudyError {
    return new StudyError(
      ErrorType.CONNECTION,
      "Fetch network request failed.",
      "Couldn't connect to the AI service. Check your internet connection and try again."
    );
  }

  static timeout(): StudyError {
    return new StudyError(
      ErrorType.TIMEOUT,
      "Generation request timed out.",
      "Generation timed out. Please try again."
    );
  }

  static rateLimit(): StudyError {
    return new StudyError(
      ErrorType.RATE_LIMIT,
      "Rate limit exceeded.",
      "Daily AI limit reached. Please try again later."
    );
  }

  static parse(details?: string): StudyError {
    return new StudyError(
      ErrorType.PARSE,
      `JSON parsing failed: ${details || ""}`,
      "We couldn't process the AI response. Please try again.",
      details
    );
  }

  static validation(details?: string): StudyError {
    return new StudyError(
      ErrorType.VALIDATION,
      `Zod validation failed: ${details || ""}`,
      "We couldn't process the AI response. Please try again.",
      details
    );
  }

  static empty(): StudyError {
    return new StudyError(
      ErrorType.EMPTY_RESPONSE,
      "Empty response returned from AI model.",
      "The AI couldn't generate study material. Try again."
    );
  }

  static configuration(details?: string): StudyError {
    return new StudyError(
      ErrorType.CONFIGURATION,
      `Server configuration error: ${details || ""}`,
      "The AI service is currently misconfigured. Please contact support.",
      details
    );
  }

  static unknown(message: string): StudyError {
    return new StudyError(
      ErrorType.UNKNOWN,
      message,
      "An unexpected error occurred. Please edit your notes and try again.",
      message
    );
  }
}
