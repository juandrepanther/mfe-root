import Box from "@mui/material/Box";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { sanitizeRedirectPath } from "@/lib/auth/redirect";
import { getOptionalSession } from "@/lib/auth/session";

type LoginPageProps = {
  searchParams: Promise<{
    redirect?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [{ redirect: redirectParam }, session] = await Promise.all([
    searchParams,
    getOptionalSession(),
  ]);

  if (session) {
    redirect(sanitizeRedirectPath(redirectParam));
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background:
          "radial-gradient(circle at top, rgba(16,42,67,0.18), transparent 38%), linear-gradient(180deg, #f7fbff 0%, #eef4ff 100%)",
      }}
    >
      <LoginForm />
    </Box>
  );
}