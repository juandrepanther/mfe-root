export type SessionUser = {
  id: string;
  email: string;
  role: string;
};

export type AuthSnapshot = {
  isAuthenticated: boolean;
  user: Pick<SessionUser, "email" | "role"> | null;
  loginUrl: string;
  logoutUrl: string;
};