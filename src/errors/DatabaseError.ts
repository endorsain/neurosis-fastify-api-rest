import { MainError } from "./MainError";

export class DatabaseError extends MainError {
  constructor(type: string, status: number, originalError?: any) {
    super(type, status, originalError);
  }

  static wrap(originalError: any): DatabaseError {
    if (originalError instanceof DatabaseError) return originalError;
    if (originalError.code === 11000) {
      return this.userAlreadyExists(originalError);
    }
    return this.unexpected(originalError);
  }

  static userAlreadyExists(originalError?: any): DatabaseError {
    return new DatabaseError("UserAlreadyExistsError", 409, originalError);
  }

  static userNotFound(originalError?: any): DatabaseError {
    return new DatabaseError("UserNotFoundError", 404, originalError);
  }

  static unexpected(originalError?: any): DatabaseError {
    return new DatabaseError("UnexpectedDatabaseError", 500, originalError);
  }
}
