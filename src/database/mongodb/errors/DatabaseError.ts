export class DatabaseError extends Error {
  status: number;
  original?: any;

  constructor(name: string, message: string, status: number, original?: any) {
    super(message);
    this.name = name;
    this.status = status;
    this.original = original;
    if (original instanceof Error && original.stack) {
      this.stack = original.stack;
    }
  }
}

export class UnexpectedDatabaseError extends DatabaseError {
  constructor(original?: any, message = "Unexpected database error") {
    super("UnexpectedDatabaseError", message, 500, original);
  }
}
