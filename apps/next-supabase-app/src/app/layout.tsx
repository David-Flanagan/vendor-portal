import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { QueryProvider } from "@/lib/query-provider";
import { Toaster } from "react-hot-toast";
// Temporarily disabled unify-ui imports

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaS Starter | Multi-tenant Business Platform",
  description: "A comprehensive multi-tenant SaaS platform with billing, team management, and enterprise features.",
  keywords: ["SaaS", "multi-tenant", "business platform", "subscription billing", "team management"],
  authors: [{ name: "SaaS Starter Team" }],
  creator: "SaaS Starter",
  publisher: "SaaS Starter",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://saas-starter.com",
    title: "SaaS Starter | Multi-tenant Business Platform",
    description: "A comprehensive multi-tenant SaaS platform with billing, team management, and enterprise features.",
    siteName: "SaaS Starter",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS Starter | Multi-tenant Business Platform",
    description: "A comprehensive multi-tenant SaaS platform with billing, team management, and enterprise features.",
    creator: "@saasstarter",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification_token",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#ffffff',
                  color: '#000000',
                  border: '1px solid #e5e7eb',
                },
              }}
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
