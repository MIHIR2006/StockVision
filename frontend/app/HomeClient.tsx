"use client";
import Landing from "@/components/Landing";
import Preloader from "@/components/Preloder";
import { useEffect, useState } from "react";

export default function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const hasLoaded = localStorage.getItem("preloaderShown");
    if (hasLoaded === "true") {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem("preloaderShown", "true");
      }, 2500); 
      return () => clearTimeout(timer);
    }
  }, []);
  return isLoading ? <Preloader /> : <Landing />;
}
