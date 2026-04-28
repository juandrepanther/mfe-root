"use client";

import type { RemoteMountProps } from "@/lib/remote-runtime";
import { isRemoteModuleCached } from "@/lib/remote-runtime";
import { loadRemoteModule } from "@/lib/remote-runtime";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";

type RemoteMountComponentProps = {
  remoteUrl: string;
  route: RemoteMountProps["route"];
  appName: string;
};

export const RemoteMount = ({
  remoteUrl,
  route,
  appName,
}: RemoteMountComponentProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;

    const mount = async () => {
      if (!containerRef.current) {
        return;
      }

      const cached = isRemoteModuleCached(remoteUrl);

      setStatus(cached ? "ready" : "loading");
      setErrorMessage(null);

      try {
        const remote = await loadRemoteModule(remoteUrl);

        if (canceled || !containerRef.current) {
          return;
        }

        remote.mount(containerRef.current, { route });
        setStatus("ready");

        return () => {
          if (containerRef.current) {
            remote.unmount(containerRef.current);
          }
        };
      } catch (error) {
        if (!canceled) {
          setStatus("error");
          setErrorMessage(error instanceof Error ? error.message : "Unknown error");
        }
      }
    };

    let cleanup: (() => void) | undefined;

    mount().then((possibleCleanup) => {
      cleanup = possibleCleanup;
    });

    return () => {
      canceled = true;
      cleanup?.();
    };
  }, [remoteUrl, route]);

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        minHeight: 280,
        borderRadius: 3,
        border: "1px solid #d6e4f0",
        backgroundColor: "#ffffff",
      }}
    >
      {status === "loading" ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CircularProgress size={22} />
          <Typography>Loading {appName} remote...</Typography>
        </Box>
      ) : null}

      {status === "error" ? (
        <Box>
          <Typography variant="h6" color="error" sx={{ mb: 1 }}>
            Failed to load {appName}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {errorMessage}
          </Typography>
          <Typography variant="caption" sx={{ color: "#5c6b7a" }}>
            Remote URL: {remoteUrl}
          </Typography>
        </Box>
      ) : null}

      <Box
        ref={containerRef}
        sx={{ display: status === "ready" ? "block" : "none" }}
      />
    </Paper>
  );
};
