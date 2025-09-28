import { MainError } from "./MainError";
import { DatabaseError } from "./DatabaseError";
import { GoogleAuthError } from "./GoogleAuthError";

export class AuthError extends MainError {
  constructor(type: string, status: number, originalError?: any) {
    super(type, status, originalError);
  }

  // Método estático para envolver errores inesperados o propagar los conocidos
  static wrap(originalError: any): AuthError {
    if (originalError instanceof AuthError) return originalError;
    if (originalError instanceof DatabaseError) return originalError;
    if (originalError instanceof GoogleAuthError) return originalError;
    return this.unexpected(originalError);
  }

  // Factory methods (como atajos para instanciar errores específicos)
  static emailOrUsernameAlreadyExists(originalError?: any): AuthError {
    return new AuthError(
      "EmailOrUsernameAlreadyExistsError",
      409,
      originalError
    );
  }

  static invalidPassword(originalError?: any): AuthError {
    return new AuthError("InvalidPasswordError", 401, originalError);
  }

  static userNotFound(originalError?: any): AuthError {
    return new AuthError("UserNotFoundError", 404, originalError);
  }

  static unexpected(originalError?: any): AuthError {
    return new AuthError("UnexpectedAuthError", 500, originalError);
  }
}
