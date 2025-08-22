import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { Navigation } from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://breakshit.blog'),
  title: {
    default: "Breaking Shit & Fixing It: An AI-Powered Homelab",
    template: "%s | Breaking Shit & Fixing It"
  },
  description: "Infrastructure as Code when you barely know how to code. Real failures, real solutions.",
  keywords: ["homelab", "infrastructure", "devops", "claude", "automation", "self-hosted"],
  authors: [{ name: "WillyV3", url: "https://willyv3.com" }],
  creator: "WillyV3",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://breakshit.blog",
    title: "Breaking Shit & Fixing It: An AI-Powered Homelab",
    description: "Infrastructure as Code when you barely know how to code. Real failures, real solutions.",
    siteName: "Breaking Shit & Fixing It",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Breaking Shit & Fixing It - Homelab Blog"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Breaking Shit & Fixing It: An AI-Powered Homelab",
    description: "Infrastructure as Code when you barely know how to code. Real failures, real solutions.",
    images: ["/og-image.png"],
    creator: "@willyv3"
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
    google: "your-google-verification-code"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: "simple"
      }}
    >
      <html lang="en">
        <body
          className="antialiased"
        >
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
