import { ZodError } from "zod";

export class MainError extends Error {
  status: number;
  type: string; // para identificar la clase de error (UserNotFound, etc.)
  originalError?: Error; // error real (Mongo, API externa, etc.)
  public details: { field: string; message: string }[];

  constructor(type: string, status: number, originalError?: Error) {
    super(); // Mensaje real si existe, sino el nombre
    this.name = this.constructor.name; // siempre "MainError" o su hijo
    this.type = type; // tu nombre de dominio del error
    this.status = status;
    this.originalError = originalError;
    this.details = [];

    // Conservar el stack real si lo hay
    if (originalError instanceof Error && originalError.stack) {
      this.stack = originalError.stack;
    }
  }

  public static userDataInput(originalError: ZodError) {
    const mainError = new MainError("ValidationError", 400, originalError);
    // Si viene de Zod, extraemos sus issues y los guardamos en details
    if (originalError instanceof ZodError) {
      mainError.details = originalError.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
    }
    return mainError;
  }

  public static unexpected(originalError?: any) {
    const mainError = new MainError("UnexpectedError", 500, originalError);
    return mainError;
  }
}
