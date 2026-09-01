import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/navigation/TopNav";
import { ScraperHealthStrip } from "@/components/scraper/ScraperHealthStrip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Intelligence",
  description: "Personal job intelligence application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-primary">
        <TopNav />
        <ScraperHealthStrip />
        <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto p-4 sm:p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
