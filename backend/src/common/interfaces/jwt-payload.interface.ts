export interface IJWTPayload {
  email: string;
  sub: string;
  twoFA?: boolean;
  isRefreshToken?: boolean;
}
