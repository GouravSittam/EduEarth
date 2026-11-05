import type { Metadata, Viewport } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import SmoothScrolling from "@/components/SmoothScrolling";

// Load Press Start 2P font
const pressStart = Press_Start_2P({
  weight: "400", // only available weight
  subsets: ["latin"],
  variable: "--font-press-start",
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL("https://edu-earth.vercel.app"),
    title: {
      default: "EduEarth - Gamified Environmental Education",
      template: "%s | EduEarth",
    },
    description:
      "Join the environmental revolution through interactive games! Learn about sustainability, climate action, and eco-friendly practices while having fun with EduEarth's engaging educational platform.",
    keywords: [
      "environmental education",
      "sustainability games",
      "climate action",
      "eco-friendly learning",
      "environmental awareness",
      "green education",
      "interactive learning",
      "educational games",
    ],
    authors: [{ name: "EduEarth Team" }],
    creator: "EduEarth",
    publisher: "EduEarth",
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
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/earth.png", sizes: "32x32", type: "image/png" },
        { url: "/earth.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/earth.png", sizes: "180x180", type: "image/png" }],
      shortcut: [{ url: "/earth.png" }],
    },
    manifest: "/site.webmanifest",
    // Social preview images come from app/opengraph-image.tsx and
    // app/twitter-image.tsx (generated at build time).
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://edu-earth.vercel.app",
      title: "EduEarth - Gamified Environmental Education",
      description:
        "Join the environmental revolution through interactive games! Learn about sustainability, climate action, and eco-friendly practices.",
      siteName: "EduEarth",
    },
    twitter: {
      card: "summary_large_image",
      title: "EduEarth - Gamified Environmental Education",
      description:
        "Learn about sustainability through interactive games and join the environmental revolution!",
      creator: "@eduearth",
    },
    category: "education",
    classification: "Educational Games",
    // No site-wide canonical: a root-level canonical would tell search
    // engines every page is a duplicate of the home page.
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="lenis">
      <head>
        <meta name="theme-color" content="#22c55e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EduEarth" />
      </head>
      <body
        className={`${pressStart.variable} antialiased min-h-dvh h-full overflow-x-hidden lenis lenis-smooth`}
      >
        <AuthProvider>
          <SmoothScrolling>
            <div className="min-h-screen w-full">{children}</div>
          </SmoothScrolling>
        </AuthProvider>
      </body>
    </html>
  );
}
