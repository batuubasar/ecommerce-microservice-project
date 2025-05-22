import { UserRole } from "users/types";

export type JwtPayload = {
  sub: number;
  email: string;
  role: UserRole;
};

export const AUTH_PATTERNS = {
  Login: 'Auth.Login',
  Verify: 'Auth.Verify',
};