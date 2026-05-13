import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { cookies, headers } from "next/headers";
import { Geist_Mono, Poppins } from "next/font/google";

import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { Providers } from "@/components/providers";
import { JsonLd } from "@/components/seo/json-ld";
import { ThemeProvider } from "@/components/theme-provider";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

function resolveLocale(headerLocale: string | null, cookieLocale: string | undefined): Locale {
  if (headerLocale && isLocale(headerLocale)) {
    return headerLocale;
  }
  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }
  return defaultLocale;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): Promise<React.ReactElement> {
  const headerList = await headers();
  const cookieStore = await cookies();
  const locale = resolveLocale(
    headerList.get("x-locale"),
    cookieStore.get("NEXT_LOCALE")?.value
  );

  return (
    <html
      lang={locale === "es" ? "es" : "en"}
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <GoogleAnalytics />
        <ThemeProvider>
          <Providers>
            <JsonLd locale={locale} />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
