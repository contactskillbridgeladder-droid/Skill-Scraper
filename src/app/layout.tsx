import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Skill Scraper | Automated Google Maps Lead Generation",
    template: "%s | Skill Scraper",
  },
  description: "Extract business leads, WhatsApp numbers, emails & social media from Google Maps. Export to CSV/XLSX. Free Chrome extension by SkillBridge Ladder.",
  keywords: ["google maps scraper", "lead generation", "whatsapp extractor", "email finder", "business data", "chrome extension", "skill scraper"],
  authors: [{ name: "SkillBridge Ladder" }],
  creator: "SkillBridge Ladder",
  metadataBase: new URL("https://scraper.skillbridgeladder.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://scraper.skillbridgeladder.in",
    siteName: "Skill Scraper",
    title: "Skill Scraper | Automated Google Maps Lead Generation",
    description: "Extract business leads, WhatsApp numbers, emails & social media from Google Maps. Export to CSV/XLSX. Free Chrome extension.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Skill Scraper — Google Maps Lead Generation Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skill Scraper | Google Maps Lead Generation",
    description: "Extract business leads from Google Maps in seconds. Free Chrome extension.",
    images: ["/og-image.png"],
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen overflow-x-hidden">
        {/* Background FX */}
        <div className="bg-grid"></div>
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>

        {/* Global Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <main className="flex-1">
            {children}
          </main>

          {/* Global Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
