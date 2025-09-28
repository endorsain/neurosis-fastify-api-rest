import { MainError } from "./MainError";

export class AuthMiddError extends MainError {
  constructor(type: string, status: number, originalError?: any) {
    super(type, status, originalError);
  }

  static wrap(originalError: any): AuthMiddError {
    if (originalError instanceof AuthMiddError) return originalError;
    return this.unexpected(originalError);
  }

  static refreshTokenMissing(originalError?: any) {
    return new AuthMiddError("RefreshTokenMissing", 401, originalError);
  }

  static unexpected(originalError?: any) {
    return new AuthMiddError("UnexpectedError", 401, originalError);
  }
}
