import { DatabaseError } from "./DatabaseError";

export class UserAlreadyExistsError extends DatabaseError {
  constructor(original?: any, message = "User already exists") {
    super("UserAlreadyExistsError", message, 409, original);
  }
}
export class UserNotFoundError extends DatabaseError {
  constructor(original?: any, message = "User not found") {
    super("UserNotFoundError", message, 404, original);
  }
}
