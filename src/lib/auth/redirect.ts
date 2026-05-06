export const sanitizeRedirectPath = (value: string | null | undefined): string => {
  if (!value) {
    return "/";
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
};

export const createLoginRedirectUrl = (pathname: string): string => {
  const redirectTarget = sanitizeRedirectPath(pathname);

  return `/login?redirect=${encodeURIComponent(redirectTarget)}`;
};