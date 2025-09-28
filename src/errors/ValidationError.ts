import { ZodError } from "zod";
import { AppError } from "./MainError";

// TODO: Dejarlo por las dudas ValidationErrorXDDD
export class ValidationErrorXDDD extends AppError {
  public details: { field: string; message: string }[];

  constructor(originalError: ZodError) {
    super("ValidationFailed", 400, originalError);
    this.details = originalError.errors.map((e: any) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  }
}
