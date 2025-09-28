import { DatabaseError } from "../../../database/mongodb/errors/DatabaseError";

export class AuthError extends Error {
  status: number;
  constructor(name: string, message: string, status: number) {
    super(message);
    this.name = name;
    this.status = status;
  }
}

export class EmailOrUsernameAlreadyExistsError extends AuthError {
  constructor(message = "Email or username already exists") {
    super("EmailOrUsernameAlreadyExistsError", message, 409);
  }
}

export class UserNotFoundError extends AuthError {
  constructor(message = "User not found") {
    super("UserNotFoundError", message, 404);
  }
}

export class InvalidPasswordError extends AuthError {
  constructor(message = "Invalid password") {
    super("InvalidPasswordError", message, 401);
  }
}

export class UnexpectedAuthError extends AuthError {
  constructor(message = "Unexpected auth error") {
    super("UnexpectedAuthError", message, 401);
  }
}

// --- Google Auth Errors ---
export class GoogleTokenInvalidError extends AuthError {
  constructor(message = "Google token is invalid") {
    super("GoogleTokenInvalidError", message, 401);
  }
}

export class GoogleTokenExpiredError extends AuthError {
  constructor(message = "Google token has expired") {
    super("GoogleTokenExpiredError", message, 401);
  }
}

export class GoogleEmailNotVerifiedError extends AuthError {
  constructor(message = "Google account email is not verified") {
    super("GoogleEmailNotVerifiedError", message, 403);
  }
}
