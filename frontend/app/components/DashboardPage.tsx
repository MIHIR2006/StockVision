'use client';
import { Dashboard } from "@/components/dashboard";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { FloatingChatbot } from "@/components/floating-chatbot";
import { StockVisionErrorBoundary } from "../../lib/error-handling";
import {
  BarChart2, ChevronLeft, ChevronRight, Home, LineChart,
  Settings, Wallet, BriefcaseBusiness, ChartNoAxesCombined, LogOut, User
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

/**
 * Renders the dashboard page layout including a collapsible sidebar, header with theme toggle and authenticated user menu, main dashboard content, mobile overlay, and a floating AI chatbot.
 *
 * The component manages sidebar collapse state (auto-collapses on mobile), determines the active dashboard section from the URL or user interaction, handles navigation (home, section changes), and provides sign-out behavior that returns to the root path.
 *
 * @returns The dashboard page React element ready for rendering within the app.
 */
export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const getUsernameFromEmail = (email?: string | null) => {
    if (!email) return 'User';
    const username = email.split('@')[0];
    // Capitalize first letter
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      const username = email.split('@')[0];
      return username.slice(0, 2).toUpperCase();
    }
    return 'U';
  };
  
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
      } else if (hash === "multi-portfolio") {
        setActiveSection("multi-portfolio");
      } else if (hash === "screener") {
        setActiveSection("screener")
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
              className={getLinkClass("multi-portfolio")}
              onClick={() => handleSectionChange("multi-portfolio")}
              type="button"
              style={{ width: '100%' }}
            >
              <BriefcaseBusiness className="h-5 w-5"/>
              {!sidebarCollapsed && <span>Multi-Portfolio</span>}
            </button>
            </li>
            <li>
             <button
              className={getLinkClass("screener")}
              onClick={() => handleSectionChange("screener")}
              type="button"
              style={{ width: '100%' }}
            >
              <ChartNoAxesCombined  className="h-5 w-5" />
              {!sidebarCollapsed && <span>Screener</span>}
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
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {session && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0 ring-2 ring-primary/30 hover:ring-primary/60 transition-all duration-300 hover:scale-105"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={session.user?.image || undefined} 
                        alt={session.user?.name || getUsernameFromEmail(session.user?.email)}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-bold shadow-lg">
                        {getInitials(session.user?.name, session.user?.email)}
                      </AvatarFallback>
                    </Avatar>
                    {/* Active indicator dot */}
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background shadow-sm" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2 p-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage 
                            src={session.user?.image || undefined} 
                            alt={session.user?.name || getUsernameFromEmail(session.user?.email)}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-bold shadow-lg">
                            {getInitials(session.user?.name, session.user?.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1 flex-1 min-w-0">
                          <p className="text-sm font-semibold leading-none truncate">
                            {session.user?.name || getUsernameFromEmail(session.user?.email)}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground truncate">
                            {session.user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleSectionChange("settings")}
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleHomeClick}
                    className="cursor-pointer"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
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
      
      {/* AI Chatbot - Only visible in dashboard for authenticated users */}
      <StockVisionErrorBoundary>
        <FloatingChatbot />
      </StockVisionErrorBoundary>
    </div>
  );
}