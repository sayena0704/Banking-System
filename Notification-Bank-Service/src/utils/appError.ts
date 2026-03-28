export class AppError extends Error {
  public status: number;
  public code: string;
  // public message: string;


  constructor(
    message: string,
    status = 500,
    code = "INTERNAL_SERVER_ERROR"
  ) {
    super(message);


    // this.message = message;
     this.status = status;
    this.code = code;


    // Required for instanceof to work correctly
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
