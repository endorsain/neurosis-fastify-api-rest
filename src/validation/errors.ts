import { ZodError } from "zod";
import { AppError } from "../errors/MainError";

export class ValidationError extends AppError {
  public details: { field: string; message: string }[];

  constructor(originalError: ZodError) {
    super("Validation failed", 400, originalError);
    this.details = originalError.errors.map((e: any) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  }
}
