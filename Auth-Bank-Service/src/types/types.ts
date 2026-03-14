export type RegisterRequestBody = {
  email: string;
  password: string;
};


export type JwtExpiry =
  | `${number}s`
  | `${number}m`
  | `${number}h`
  | `${number}d`
  | `${number}w`
  | number;


export interface JwtPayload {
    userId: string;
    email?: string;
    role: "USER" | "ADMIN";
    type: 'access'| 'refresh';
}


export type LoginBody = { email: string; password: string };
export type RefreshBody = { refreshToken: string };
export type LogoutBody = { refreshToken: string };

