import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from '@clerk/nextjs'
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/FooterStuff";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "@/components/ui/8bit/styles/retro.css";

const virtue = localFont({
  src: "../../public/virtue.ttf",
  variable: "--font-virtue",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://builtbywilly.com'),
  title: {
    default: "BuiltByWilly - Portfolio & Projects",
    template: "%s | BuiltByWilly"
  },
  description: "Portfolio of TUI apps, web projects, AI experiments, and open source contributions by WillyV3. Building things and breaking them since forever.",
  keywords: ["portfolio", "TUI", "web development", "AI tools", "open source", "go", "next.js", "bubbletea"],
  authors: [{ name: "WillyV3", url: "https://willyv3.com" }],
  creator: "WillyV3",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://builtbywilly.com",
    title: "BuiltByWilly - Portfolio & Projects",
    description: "Portfolio of TUI apps, web projects, AI experiments, and open source contributions by WillyV3.",
    siteName: "BuiltByWilly",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuiltByWilly - Portfolio & Projects"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "BuiltByWilly - Portfolio & Projects",
    description: "Portfolio of TUI apps, web projects, AI experiments, and open source contributions.",
    images: ["/og-image.png"],
    creator: "@V3_Willy"
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
          className={`${virtue.variable} antialiased`}
        >
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
