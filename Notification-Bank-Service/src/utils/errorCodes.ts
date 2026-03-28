export const ErrorCodes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
} as const;


export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];
