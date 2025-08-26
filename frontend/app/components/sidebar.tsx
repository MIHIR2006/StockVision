'use client';
import { BarChart2, ChevronLeft, Home, LineChart, Settings, Wallet, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ isOpen, onClose, activeSection, onSectionChange }: SidebarProps) {
  const router = useRouter();

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
      router.push(route);
    } else {
      if (section !== 'home') {
        router.push(`/dashboard#${section}`);
      }
    }
    onClose();
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
          "border-r bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out z-40 h-full fixed top-0 left-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:translate-x-0"
        )}
        style={{ width: '16rem' }} // w-64
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            <span className="font-bold">StockVision</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} type="button" className="md:hidden">
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
                <span>Home</span>
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
                <span>Dashboard</span>
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
                <span>Performance</span>
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
                <span>Portfolio</span>
              </button>
            </li>
            <li>
              <button
                className={getLinkClass("screener")}
                onClick={() => handleNavigation("screener")}
                type="button"
                style={{ width: '100%' }}
              >
                <Search className="h-5 w-5" />
                <span>Screener</span>
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
                <span>Settings</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
