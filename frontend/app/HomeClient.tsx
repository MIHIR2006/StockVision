"use client";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import Landing from "@/components/Landing";
import Preloader from "@/components/Preloder";

let hasShownPreloader = false;
export default function HomeClient() {
  const [isLoading, setIsLoading] = useState(!hasShownPreloader);

  useEffect(() => {
    if (!hasShownPreloader) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        hasShownPreloader = true; 
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);

  return isLoading ? <Preloader /> : (
    <SessionProvider>
      <Landing />
    </SessionProvider>
  );
}
