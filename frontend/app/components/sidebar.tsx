'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import {
  BarChart2,
  Home,
  LineChart,
  Settings,
  Wallet,
  BriefcaseBusiness,
  CircleDollarSign,
  TrendingUp
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ isOpen, onClose, activeSection, onSectionChange }: SidebarProps) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  const getLinkClass = (section: string) => {
    const baseClass = "flex items-center justify-center p-3 rounded-md transition-colors";
    const activeClass = "bg-sidebar-accent text-sidebar-accent-foreground";
    const inactiveClass = "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
    return cn(baseClass, activeSection === section ? activeClass : inactiveClass);
  };

  const handleNavigation = (section: string, route?: string) => {
    onSectionChange(section);
    if (route) {
      router.push(route);
    } else {
      if (section !== 'home') {
        router.push(`/dashboard#${section}`);
      }
    }
    if (isMobile) setSidebarCollapsed(true);
    onClose();
  };

  const handleHomeClick = () => {
    router.push("/");
    onClose();
  };

  return (
    <>
      {/* Sidebar as Icon Dock */}
      <div
        className={cn(
          "fixed top-1/2 left-0 -translate-y-1/2 z-20 w-16 rounded-r-xl bg-blue/10 backdrop-blur-md border-r border-white/10 shadow-lg transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="flex flex-col items-center justify-center py-4 space-y-4">
          <button
            className={getLinkClass("home")}
            onClick={handleHomeClick}
            type="button"
          >
            <Home className="h-6 w-6" />
          </button>
          <button
            className={getLinkClass("overview")}
            onClick={() => handleNavigation("overview")}
            type="button"
          >
            <BarChart2 className="h-6 w-6" />
          </button>
          <button
            className={getLinkClass("performance")}
            onClick={() => handleNavigation("performance")}
            type="button"
          >
            <LineChart className="h-6 w-6" />
          </button>
          <button
            className={getLinkClass("portfolio")}
            onClick={() => handleNavigation("portfolio")}
            type="button"
          >
            <Wallet className="h-6 w-6" />
          </button>
          <button
            className={getLinkClass("multi-portfolio")}
            onClick={() => handleNavigation("multi-portfolio")}
            type="button"
          >
            <BriefcaseBusiness className="h-6 w-6" />
          </button>
          <button
            className={getLinkClass("screener")}
            onClick={() => handleNavigation("screener")}
            type="button"
          >
            <TrendingUp className="h-6 w-6" />
          </button>
          <button
            className={getLinkClass("settings")}
            onClick={() => handleNavigation("settings")}
            type="button"
          >
            <Settings className="h-6 w-6" />
          </button>
        </nav>
      </div>

      {/* Mobile Overlay */}
      {(isOpen || (!sidebarCollapsed && isMobile)) && (
        <div
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => {
            setSidebarCollapsed(true);
            onClose();
          }}
        />
      )}
    </>
  );
}
