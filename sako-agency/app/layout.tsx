import type { Metadata } from "next";
import { Outfit, Playfair_Display, JetBrains_Mono, Cormorant, Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthProvider from "@/components/AuthProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import GlobalErrorHandler from "@/components/GlobalErrorHandler";
import JsonLd from "@/components/JsonLd";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["300"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sako.agency"),
  title: {
    default: "SAKO — Future-Forward Digital Agency",
    template: "%s | SAKO Agency",
  },
  description:
    "Bespoke digital experiences — Web, UI/UX, SEO, and AI automation — for brands that refuse to be average.",
  keywords: [
    "digital agency",
    "web development",
    "UI/UX design",
    "SEO",
    "AI automation",
    "branding",
    "SAKO",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SAKO Agency",
    title: "SAKO — Future-Forward Digital Agency",
    description:
      "Bespoke digital experiences — Web, UI/UX, SEO, and AI automation — for brands that refuse to be average.",
    url: "https://sako.agency",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAKO — Future-Forward Digital Agency",
    description:
      "Bespoke digital experiences — Web, UI/UX, SEO, and AI automation — for brands that refuse to be average.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${playfair.variable} ${jetbrains.variable} ${cormorant.variable} ${syne.variable} ${dmSans.variable}`}
    >
      <body suppressHydrationWarning>
        <GlobalErrorHandler />
        <JsonLd />
        <ErrorBoundary componentName="RootLayout">
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
              <div className="grid-overlay" />
              <div className="noise-overlay" />
              <SmoothScroll />
              <ScrollProgress />
              {children}
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
