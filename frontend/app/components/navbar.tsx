'use client';

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
import { BarChart2, LogIn, Settings, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

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

  return (
    <header className="border-b backdrop-blur-lg bg-background/80 sticky top-0 z-50">
      {/* Progress Bar Placeholder */}
      <div className="h-1 w-full" />

      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={onMenuClick}
        >
          <BarChart2 className="h-6 w-6 text-primary" />
          <span className="font-extrabold text-xl">StockVision</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {status === "loading" ? (
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          ) : session ? (
            // User is authenticated - show profile dropdown
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-11 w-11 rounded-full p-0 ring-2 ring-primary/30 hover:ring-primary/60 transition-all duration-300 hover:scale-105"
                >
                  <Avatar className="h-11 w-11">
                    <AvatarImage 
                      src={session.user?.image || undefined} 
                      alt={session.user?.name || getUsernameFromEmail(session.user?.email)} 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-base shadow-lg">
                      {getInitials(session.user?.name, session.user?.email)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Active indicator dot */}
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background shadow-sm" />
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
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard#settings" className="cursor-pointer flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
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
          ) : (
            // User is not authenticated - show Sign In button
            <Link href="/login">
              <Button
                className="relative overflow-hidden font-bold flex items-center gap-2 px-6 py-3 
                      rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 
                      text-white hover:scale-105 transition-transform"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </span>

                {/* shimmer overlay */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent 
                            translate-x-[-100%] animate-[shimmer_2s_infinite]" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
