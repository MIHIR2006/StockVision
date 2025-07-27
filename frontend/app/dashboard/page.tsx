import DashboardPage from "@/components/DashboardPage";
// import Preloader from "@/components/Preloder";
// import { Suspense } from "react";

export const metadata = {
  title: "Dashboard | Stock Vision - AI/ML Stock Portfolio Analytics",
  description: "Access your personalized dashboard on Stock Vision. Visualize portfolio performance, analyze stocks, and leverage AI/ML-powered insights for smarter investing.",
  keywords: [
    "Stock Vision dashboard",
    "portfolio analytics",
    "AI investing",
    "ML stock analysis",
    "performance visualization",
    "investment dashboard"
  ],
  openGraph: {
    title: "Dashboard | Stock Vision - AI/ML Stock Portfolio Analytics",
    description: "Access your personalized dashboard on Stock Vision. Visualize portfolio performance, analyze stocks, and leverage AI/ML-powered insights for smarter investing.",
    url: "https://stock-vision-seven.vercel.app/dashboard",
    siteName: "Stock Vision",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard | Stock Vision - AI/ML Stock Portfolio Analytics",
    description: "Access your personalized dashboard on Stock Vision. Visualize portfolio performance, analyze stocks, and leverage AI/ML-powered insights for smarter investing."
  }
};

export default function Dashboard() {
  return (
    // <Suspense fallback={<Preloader />}>
      <DashboardPage />
    // </Suspense>
  );
} 