export interface IJWTPayload {
  email: string;
  sub: string;
  type: 'access' | 'refresh' | 'emailVerification';
  twoFA?: boolean;
}
