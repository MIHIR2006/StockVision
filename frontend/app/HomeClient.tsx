"use client";
import { useEffect, useState } from "react";
import Landing from "@/components/Landing";
import SimpleLanding from "@/components/SimpleLanding";
import Preloader from "@/components/Preloder";

let hasShownPreloader = false;
export default function HomeClient() {
  // Temporarily disable preloader for debugging
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!hasShownPreloader) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        hasShownPreloader = true; 
      }, 500); // Reduced to 0.5 seconds for testing

      return () => clearTimeout(timer);
    }
  }, []);

  // Use original Landing component
  return isLoading ? <Preloader /> : <Landing />;
}
