"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/prices", label: "Prices" },
];

type TopAppBarProps = {
  user: {
    email: string;
    role: string;
  };
};

export const TopAppBar = ({ user }: TopAppBarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogout = async () => {
    setIsSigningOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      router.push("/login");
      router.refresh();
      setIsSigningOut(false);
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#102a43" }}>
      <Toolbar sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ mr: 2 }}>
          MFE Dashboard
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {navItems.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                color="inherit"
                variant={pathname === item.href ? "outlined" : "text"}
                sx={{ borderColor: "rgba(255,255,255,0.35)" }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>
            {user.email} ({user.role})
          </Typography>

          <Button color="inherit" disabled={isSigningOut} onClick={handleLogout}>
            {isSigningOut ? <CircularProgress color="inherit" size={18} /> : "Logout"}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
