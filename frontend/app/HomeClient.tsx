"use client";
import Landing from "@/components/Landing";
import Preloader from "@/components/Preloder";
import { useEffect, useState } from "react";

export default function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);
  return isLoading ? <Preloader /> : <Landing />;
} 