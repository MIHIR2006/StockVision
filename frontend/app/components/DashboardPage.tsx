'use client';
import { Dashboard } from "@/components/dashboard";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  BarChart2, ChevronLeft, ChevronRight, Home, LineChart, Menu,
  Settings, Wallet
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";
import { PortfolioSection } from "./portfolio-section"; // Import the new component

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validSections = ['overview', 'performance', 'portfolio', 'settings'];
      if (validSections.includes(hash)) {
        setActiveSection(hash);
      } else {
        setActiveSection('overview');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []); // Empty dependency array ensures this runs only once on mount to set up listener

  const handleSectionChange = (section: string) => {
    router.push(`/dashboard#${section}`);
    if (isMobile) setSidebarOpen(false);
  };

  const handleHomeClick = () => {
    router.push("/");
    if (isMobile) setSidebarOpen(false);
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* Mobile Sidebar */}
      {isMobile && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
      )}

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "border-r bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out z-20 h-full hidden md:flex md:flex-col",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* ... desktop sidebar content ... */}
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-4 backdrop-blur-lg bg-background/80 z-10 sticky top-0">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
              type="button"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-extrabold ml-2">Dashboard</h1>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-y-auto">
          {activeSection === 'portfolio' ? (
            <PortfolioSection />
          ) : (
            <Dashboard activeSection={activeSection} onSectionChange={handleSectionChange} />
          )}
        </main>
      </div>
    </div>
  );
}
