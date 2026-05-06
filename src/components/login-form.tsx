"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          redirectTo: searchParams.get("redirect"),
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        redirectTo?: string;
      };

      if (!response.ok || !payload.redirectTo) {
        setErrorMessage(payload.error ?? "Unable to sign in.");
        return;
      }

      router.push(payload.redirectTo);
      router.refresh();
    } catch {
      setErrorMessage("Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        maxWidth: 440,
        borderRadius: 4,
        p: { xs: 3, sm: 4 },
      }}
    >
      <Stack spacing={3} component="form" onSubmit={handleSubmit}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Sign in
          </Typography>
          <Typography sx={{ color: "#486581" }}>
            Authenticate once in the dashboard to access all mounted micro-frontends.
          </Typography>
        </Box>

        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        <TextField
          autoComplete="email"
          label="Email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />

        <TextField
          autoComplete="current-password"
          label="Password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />

        <Button disabled={isSubmitting} size="large" type="submit" variant="contained">
          {isSubmitting ? <CircularProgress color="inherit" size={20} /> : "Sign in"}
        </Button>
      </Stack>
    </Paper>
  );
};