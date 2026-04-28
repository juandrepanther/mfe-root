"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/prices", label: "Prices" },
];

export const TopAppBar = () => {
  const pathname = usePathname();

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#102a43" }}>
      <Toolbar sx={{ display: "flex", gap: 1 }}>
        <Typography variant="h6" sx={{ mr: 2 }}>
          MFE Dashboard
        </Typography>
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
      </Toolbar>
    </AppBar>
  );
};
