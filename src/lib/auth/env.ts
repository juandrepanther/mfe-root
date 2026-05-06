const requireEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const getJwtSecret = (): string => requireEnv("AUTH_JWT_SECRET");

export const getPasswordSecret = (): string => requireEnv("AUTH_PASSWORD_SECRET");

export const getDashboardBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL ?? "http://localhost:3000";
};