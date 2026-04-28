import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Providers } from "@/components/providers";
import { TopAppBar } from "@/components/top-app-bar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Micro Frontend Dashboard",
  description: "Next.js dashboard shell with Vite remotes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <Providers>
            <TopAppBar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <Box>{children}</Box>
            </Container>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
