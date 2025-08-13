"use client";
import Landing from "@/components/Landing";
import Preloader from "@/components/Preloder";
import { hasPreloaderBeenShown, markPreloaderAsShown } from "@/lib/preloader-utils";
import { useEffect, useState } from "react";

export default function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasShownPreloader, setHasShownPreloader] = useState(false);

  useEffect(() => {
    // Check if preloader has been shown before
    if (hasPreloaderBeenShown()) {
      // Preloader has been shown before, skip it
      setIsLoading(false);
      setHasShownPreloader(true);
    } else {
      // First time visit, show preloader
      const timer = setTimeout(() => {
        setIsLoading(false);
        // Mark preloader as shown
        markPreloaderAsShown();
        setHasShownPreloader(true);
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Show preloader only if it hasn't been shown before and we're currently loading
  if (isLoading && !hasShownPreloader) {
    return <Preloader />;
  }

  // Show landing page
  return <Landing />;
} 