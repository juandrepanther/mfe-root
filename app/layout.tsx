import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
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
        <Providers>
          <TopAppBar />
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box>{children}</Box>
          </Container>
        </Providers>
      </body>
    </html>
  );
}
