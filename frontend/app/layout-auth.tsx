import Providers from "@/components/Providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/styles/globals.css";
import { Analytics } from '@vercel/analytics/react';
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "Stock Vision | Stock Market Performance Visualizer & Analyzer",
  description: "Stock Vision is a stock market performance visualizer and analyzer using the latest AI and ML data. Analyze, visualize, and optimize your investments with advanced analytics and insights.",
  keywords: [
    "Stock Vision",
    "stock market",
    "performance visualizer",
    "AI stock analysis",
    "ML stock analysis",
    "investment analytics",
    "portfolio analyzer",
    "financial dashboard",
    "stock analyzer",
    "AI investing"
  ],
  openGraph: {
    title: "Stock Vision | Stock Market Performance Visualizer & Analyzer",
    description: "Stock Vision is a stock market performance visualizer and analyzer using the latest AI and ML data. Analyze, visualize, and optimize your investments with advanced analytics and insights.",
    url: "https://stock-vision-seven.vercel.app/",
    siteName: "Stock Vision",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Stock Vision | Stock Market Performance Visualizer & Analyzer",
    description: "Stock Vision is a stock market performance visualizer and analyzer using the latest AI and ML data. Analyze, visualize, and optimize your investments with advanced analytics and insights."
  }
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <Providers>
            <ThemeProvider defaultTheme="system" attribute="class">
              <TooltipProvider>
                {children}
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </ThemeProvider>
          </Providers>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
