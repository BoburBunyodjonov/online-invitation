"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  IconButton,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  SquaresFourIcon,
  TicketIcon,
  SignOutIcon,
  HeartIcon,
  ListIcon,
  GearSixIcon,
  ChartBarIcon,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

const DRAWER_WIDTH = 260;

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("admin");
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = [
    { href: "/admin/dashboard", label: t("dashboard"), icon: ChartBarIcon },
    { href: "/admin/orders", label: t("orders"), icon: TicketIcon },
    { href: "/admin/templates", label: t("templates"), icon: SquaresFourIcon },
    { href: "/admin/settings", label: t("settings"), icon: GearSixIcon },
  ];

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ px: 2.5 }}>
        <HeartIcon weight="fill" size={22} color="var(--color-brand)" />
        <Typography
          sx={{
            ml: 1,
            fontFamily: "var(--font-serif)",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          {t("title")}
        </Typography>
      </Toolbar>
      <List sx={{ px: 1.5, flex: 1 }}>
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              selected={active}
              sx={{
                mb: 0.5,
                borderRadius: 3,
                "&.Mui-selected": {
                  bgcolor: alpha("#b08968", 0.14),
                  color: "primary.dark",
                  "& .MuiListItemIcon-root": { color: "primary.main" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <item.icon weight="duotone" size={22} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: { sx: { fontWeight: active ? 700 : 500 } },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
          {email}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh", bgcolor: "var(--color-bg-subtle)" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (th) => th.zIndex.drawer + 1,
          bgcolor: alpha("#fdfcfb", 0.88),
          backdropFilter: "blur(16px)",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          {isMobile && (
            <IconButton edge="start" onClick={() => setMobileOpen(true)}>
              <ListIcon weight="bold" />
            </IconButton>
          )}
          <Typography
            sx={{
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              display: { xs: "block", md: "none" },
            }}
          >
            {t("title")}
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Button
            variant="text"
            startIcon={<SignOutIcon weight="duotone" />}
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            sx={{ color: "text.secondary" }}
          >
            {t("logout")}
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              borderColor: "divider",
              bgcolor: alpha("#fff", 0.92),
              backdropFilter: "blur(12px)",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar />
        <Box sx={{ maxWidth: 1280, mx: "auto" }}>{children}</Box>
      </Box>
    </Box>
  );
}
