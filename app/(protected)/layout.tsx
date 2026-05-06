import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { TopAppBar } from "@/components/top-app-bar";
import { getRequiredSession } from "@/lib/auth/session";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getRequiredSession();

  return (
    <>
      <TopAppBar user={{ email: session.email, role: session.role }} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box>{children}</Box>
      </Container>
    </>
  );
}