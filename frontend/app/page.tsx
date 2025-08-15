export const metadata = {
  title: "Stock Vision",
  description: "Visualize and analyze your stock market performance with Stock Vision. Leverage the latest AI and ML data to optimize your investments and gain actionable insights.",
  keywords: [
    "Stock Vision",
    "AI stock analysis",
    "ML stock analysis",
    "stock market visualization",
    "investment analytics",
    "portfolio analyzer",
    "financial dashboard"
  ],
  openGraph: {
    title: "Stock Vision | AI-Powered Stock Market Visualizer & Analyzer",
    description: "Visualize and analyze your stock market performance with Stock Vision. Leverage the latest AI and ML data to optimize your investments and gain actionable insights.",
    url: "https://stock-vision-seven.vercel.app/",
    siteName: "Stock Vision",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Stock Vision | AI-Powered Stock Market Visualizer & Analyzer",
    description: "Visualize and analyze your stock market performance with Stock Vision. Leverage the latest AI and ML data to optimize your investments and gain actionable insights."
  }
};

import HomeClient from "./HomeClient";

export default function Home() {
  return <HomeClient/>;
} 