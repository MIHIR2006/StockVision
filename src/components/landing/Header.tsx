import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { BarChart2, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="border-b backdrop-blur-lg bg-background/80 sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2" aria-label="StockVision Home">
          <BarChart2 className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="font-extrabold text-xl">StockVision</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/dashboard">
            <Button 
              className="font-bold hover:scale-105 transition-transform flex items-center gap-2"
              aria-label="Sign in to dashboard"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
} 