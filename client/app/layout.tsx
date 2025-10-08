import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

// Load Press Start 2P font
const pressStart = Press_Start_2P({
  weight: "400", // only available weight
  subsets: ["latin"],
  variable: "--font-press-start",
});

export async function generateMetadata(): Promise<Metadata> {
  return {
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
        { url: "/eduearth-logo.png", sizes: "32x32", type: "image/png" },
        { url: "/eduearth-logo.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [
        { url: "/eduearth-logo.png", sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: "/site.webmanifest",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://eduearth-sih.vercel.app",
      title: "EduEarth - Gamified Environmental Education",
      description:
        "Join the environmental revolution through interactive games! Learn about sustainability, climate action, and eco-friendly practices.",
      siteName: "EduEarth",
      images: [
        {
          url: "/eduearth-og-image.png",
          width: 1200,
          height: 630,
          alt: "EduEarth - Environmental Education Games",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "EduEarth - Gamified Environmental Education",
      description:
        "Learn about sustainability through interactive games and join the environmental revolution!",
      images: ["/eduearth-twitter-image.png"],
      creator: "@eduearth",
    },
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
    },
    verification: {
      google: "your-google-verification-code",
      yandex: "your-yandex-verification-code",
    },
    category: "education",
    classification: "Educational Games",
    alternates: {
      canonical: "https://eduearth-sih.vercel.app",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pressStart.variable} antialiased min-h-dvh h-full overflow-x-hidden`}
      >
        <div className="min-h-screen w-full">{children}</div>
      </body>
    </html>
  );
}
