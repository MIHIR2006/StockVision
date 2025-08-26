"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"github" | "google" | null>(null);
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();

  // Detect initial theme on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDarkMode = window.document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      if (isDark) {
        root.classList.remove("dark");
      } else {
        root.classList.add("dark");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }
    // Call signup API
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Signup failed.");
      setLoading(false);
      return;
    }
    // Auto-login after signup
    const loginRes = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (loginRes?.error) {
      setError("Signup succeeded but login failed. Try logging in manually.");
    } else {
      router.push("/dashboard");
    }
  };

  const handleNavigation = (href: string) => {
    setIsNavigating(true);
    router.push(href);
  };

  const handleSocialSignIn = async (provider: "github" | "google") => {
    setSocialLoading(provider);
    setError("");
    
    try {
      const result = await signIn(provider, { 
        redirect: false,
        callbackUrl: "/dashboard"
      });
      
      if (result?.error) {
        setError(`Failed to sign up with ${provider}. Please try again.`);
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      setError(`An error occurred while signing up with ${provider}.`);
    } finally {
      setSocialLoading(null);
    }
  };

  if (isNavigating) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md mx-auto mt-20 p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-4">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : (
          <Moon className="h-5 w-5 text-gray-600" />
        )}
      </button>

      <div className="w-full max-w-xs md:max-w-md mx-auto mt-20 p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-2">
            <input
              type="email"
              autoComplete="off"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-2 py-2 md:px-4 md:py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all duration-200"
              required
            />
          </div>
          <div className="space-y-2">
            <input
              type="password"
              autoComplete="off"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-2 py-2 md:px-4 md:py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all duration-200"
              required
            />
          </div>
          {error && <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800">{error}</div>}
          <button
            type="submit"
            className="w-full px-2 py-2 md:px-4 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg transition-all duration-200 font-semibold transform hover:scale-105 active:scale-95"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="flex flex-col gap-3 mt-8">
          <button
            className="w-full px-4 py-2 md:px-6 md:py-3 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded-xl shadow-lg transition-all duration-200 font-semibold border border-gray-300 dark:border-gray-600 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            type="button"
            onClick={() => handleSocialSignIn("github")}
            disabled={socialLoading !== null}
          >
            {socialLoading === "github" ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Signing up with GitHub...
              </div>
            ) : (
              "Sign up with GitHub"
            )}
          </button>
          <button
            className="w-full px-4 py-2 md:px-6 md:py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transition-all duration-200 font-semibold border border-red-300 dark:border-red-600 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            type="button"
            onClick={() => handleSocialSignIn("google")}
            disabled={socialLoading !== null}
          >
            {socialLoading === "google" ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Signing up with Google...
              </div>
            ) : (
              "Sign up with Google"
            )}
          </button>
        </div>
        <div className="text-center mt-6 text-gray-600 dark:text-gray-300">
          Already have an account? <button onClick={() => handleNavigation("/login")} className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline transition-colors">Login</button>
        </div>
      </div>
    </main>
  );
}
