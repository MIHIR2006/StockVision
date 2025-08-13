'use client';
import { BarChart2, ChevronLeft, ChevronRight, Home, LineChart, Settings, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ isOpen, onClose, activeSection, onSectionChange }: SidebarProps) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, [isMobile]);

  const getLinkClass = (section: string) => {
    const baseClass = "flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full";
    const activeClass = "bg-sidebar-accent text-sidebar-accent-foreground";
    const inactiveClass = "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-105";
    return cn(
      baseClass,
      activeSection === section ? activeClass : inactiveClass
    );
  };

  const handleNavigation = (section: string, route?: string) => {
    onSectionChange(section);
    if (route) {
      // For separate pages
      router.push(route);
    } else {
      // For hash-based navigation within dashboard
      if (section !== 'home') {
        router.push(`/dashboard#${section}`);
      }
    }
    if (isMobile) setSidebarCollapsed(true);
    if (onClose) onClose();
  };

  const handleHomeClick = () => {
    router.push("/");
    onClose();
  };

  return (
    <>
      {/* Sidebar Panel */}
      <div
        className={cn(
          "border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out z-20 h-full fixed top-0 left-0",
          isOpen ? "w-64" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center gap-2" onClick={()=>setSidebarCollapsed(true)}>
            <BarChart2 className="h-5 w-5 text-primary" />
            <span className="font-bold">StockVision</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} type="button">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Menu */}
        <nav className="p-2 h-[calc(100%-4rem)] overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <button
                className={getLinkClass("home")}
                onClick={handleHomeClick}
                type="button"
                style={{ width: '100%' }}
              >
                <Home className="h-5 w-5" />
                {!sidebarCollapsed && <span>Home</span>}
              </button>
            </li>
            <li>
              <button
                className={getLinkClass("overview")}
                onClick={() => handleNavigation("overview")}
                type="button"
                style={{ width: '100%' }}
              >
                <BarChart2 className="h-5 w-5" />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </button>
            </li>
            <li>
              <button
                className={getLinkClass("performance")}
                onClick={() => handleNavigation("performance")}
                type="button"
                style={{ width: '100%' }}
              >
                <LineChart className="h-5 w-5" />
                {!sidebarCollapsed && <span>Performance</span>}
              </button>
            </li>
           
            <li>
              <button
                className={getLinkClass("portfolio")}
                onClick={() => handleNavigation("portfolio")}
                type="button"
                style={{ width: '100%' }}
              >
                <Wallet className="h-5 w-5" />
                {!sidebarCollapsed && <span>Portfolio</span>}
              </button>
            </li>
            <li>
              <button
                className={getLinkClass("settings")}
                onClick={() => handleNavigation("settings")}
                type="button"
                style={{ width: '100%' }}
              >
                <Settings className="h-5 w-5" />
                {!sidebarCollapsed && <span>Settings</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10"
          onClick={onClose}
        />
      )}
    </>
  );
}