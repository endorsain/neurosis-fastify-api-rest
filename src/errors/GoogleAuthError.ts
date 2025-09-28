import { MainError } from "./MainError";

export class GoogleAuthError extends MainError {
  constructor(type: string, status: number, originalError?: Error) {
    super(type, status, originalError);
  }

  static wrap(originalError: any): GoogleAuthError {
    if (originalError instanceof GoogleAuthError) return originalError;
    return this.unexpected(originalError);
  }

  static googleTokenInvalid(originalError?: any): GoogleAuthError {
    return new GoogleAuthError("GoogleTokenInvalidError", 401, originalError);
  }

  static googleTokenExpired(originalError?: any): GoogleAuthError {
    return new GoogleAuthError("GoogleTokenExpiredError", 401, originalError);
  }

  static googleEmailNotVerified(originalError?: any): GoogleAuthError {
    return new GoogleAuthError(
      "GoogleEmailNotVerifiedError",
      403,
      originalError
    );
  }

  static unexpected(originalError?: any): GoogleAuthError {
    return new GoogleAuthError("GoogleUnexpectedError", 500, originalError);
  }
}
