import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Skill Scraper | Automated Google Maps Lead Generation",
  description: "Extract business leads, WhatsApp numbers, emails & social media from Google Maps. Export to CSV/XLSX. Free Chrome extension.",
  keywords: "google maps scraper, lead generation, whatsapp extractor, email finder, business data",
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
