import type { Metadata } from "next";
import "./globals.css";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthProvider from "@/components/AuthProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import GlobalErrorHandler from "@/components/GlobalErrorHandler";

export const metadata: Metadata = {
  title: "SAKO — Future-Forward Digital Agency",
  description: "Bespoke digital experiences — Web, UI/UX, SEO, and AI automation — for brands that refuse to be average.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <GlobalErrorHandler />
        <ErrorBoundary componentName="RootLayout">
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
              <div className="grid-overlay" />
              <div className="noise-overlay" />
              <SmoothScroll />
              <ScrollProgress />
              <Cursor />
              {children}
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
