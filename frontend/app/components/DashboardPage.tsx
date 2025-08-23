'use client';
import { Dashboard } from "@/components/dashboard";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  BarChart2, ChevronLeft, ChevronRight, Home, LineChart,
  Settings, Wallet
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");
  
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, [isMobile]);
  
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    
    if (location.pathname === "/") {
      setActiveSection("home");
    } else if (location.pathname === "/dashboard") {
      if (hash === "performance") {
        setActiveSection("performance");
      } else if (hash === "portfolio") {
        setActiveSection("portfolio");
      } else if (hash === "settings") {
        setActiveSection("settings");
      } else{
        setActiveSection("overview");
      }
    }
  }, []);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (isMobile) setSidebarCollapsed(true);
  };

  const handleHomeClick = () => {
    router.push("/");
    if (isMobile) setSidebarCollapsed(true);
  };
  
  const getLinkClass = (section) => {
    const baseClass = "flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full";
    const activeClass = "bg-sidebar-accent text-sidebar-accent-foreground";
    const inactiveClass = "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-105";
    return cn(
      baseClass,
      activeSection === section ? activeClass : inactiveClass
    );
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* Sidebar */}
      <div
        className={cn(
          "border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out z-20 h-full",
          sidebarCollapsed ? "w-16" : "w-64",
          isMobile ? "fixed top-0 bottom-0" : "relative",
          isMobile && sidebarCollapsed ? "-left-16" : "left-0"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              <span className="font-bold">StockVision</span>
            </div>
          )}
          {sidebarCollapsed && <BarChart2 className="h-5 w-5 mx-auto text-primary" />}
          <Button
            variant="ghost"
            size="icon"
            className="md:flex hidden"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            type="button"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
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
                onClick={() => handleSectionChange("overview")}
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
                onClick={() => handleSectionChange("performance")}
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
                onClick={() => handleSectionChange("portfolio")}
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
              onClick={() => handleSectionChange("settings")}
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

      {/* Main content */}
      <div className={cn(
        "flex flex-col flex-1 h-full overflow-hidden",
        isMobile ? (sidebarCollapsed ? "ml-0" : "ml-64") : "ml-0"
      )}>
        <header className="h-16 border-b flex items-center justify-between px-4 backdrop-blur-lg bg-background/80 z-10 sticky top-0">
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              type="button"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
          <h1 className="text-xl font-extrabold">Dashboard</h1>
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-y-auto">
          <Dashboard activeSection={activeSection} onSectionChange={handleSectionChange} />
        </main>
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  );
}
