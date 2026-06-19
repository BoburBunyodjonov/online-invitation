"use client";

import { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { muiTheme } from "@/lib/mui-theme";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SessionProvider>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </SessionProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
