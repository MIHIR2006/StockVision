"use client";
import { Eye, EyeClosed, Moon, StepBack, Sun } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BackgroundGradientAnimation } from "../../components/ui/background-gradient-animation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"github" | "google" | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Initialize router
  const router = useRouter();

  // Detect initial theme on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDarkMode = window.document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window === "undefined") return;
    const root = window.document.documentElement;
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    } as any);
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
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
        callbackUrl: "/dashboard",
      } as any);

      if (result?.error) {
        setError(`Failed to sign in with ${provider}. Please try again.`);
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      setError(`An error occurred while signing in with ${provider}.`);
    } finally {
      setSocialLoading(null);
    }
  };

  if (isNavigating) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
        {/* Background Gradient Animation */}
        <div className="absolute inset-0 z-0">
          <BackgroundGradientAnimation
            gradientBackgroundStart="rgb(15, 23, 42)"
            gradientBackgroundEnd="rgb(30, 41, 59)"
            firstColor="30, 58, 138"
            secondColor="55, 48, 163"
            thirdColor="17, 24, 39"
            fourthColor="67, 56, 202"
            fifthColor="30, 64, 175"
            pointerColor="59, 130, 246"
            size="80%"
            blendingValue="multiply"
            containerClassName="h-screen w-screen"
          />
        </div>
        
        {/* Exit to Landing Page Button */}
        <button
          onClick={() => router.push("/")}
          className="absolute z-20 top-6 left-6 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200"
          aria-label="Back to landing page"
        >
          <StepBack className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="relative z-10 w-full max-w-md mx-auto mt-20 p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-4">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Gradient Animation */}
      <div className="absolute inset-0 z-0">
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(15, 23, 42)"
          gradientBackgroundEnd="rgb(30, 41, 59)"
          firstColor="30, 58, 138"
          secondColor="55, 48, 163"
          thirdColor="17, 24, 39"
          fourthColor="67, 56, 202"
          fifthColor="30, 64, 175"
          pointerColor="59, 130, 246"
          size="80%"
          blendingValue="multiply"
          containerClassName="h-screen w-screen"
        />
      </div>

      {/* Exit to Landing Page Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute z-20 top-6 left-6 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label="Back to landing page"
      >
        <StepBack className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute z-20 top-6 right-6 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-600" />}
      </button>

      <div className="relative z-10 w-full max-w-xs md:max-w-md mx-auto mt-20 p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-2 py-2 md:px-4 md:py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all duration-200"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-2 py-2 md:px-4 md:py-3 pr-12 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeClosed className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-yellow-500 dark:text-yellow-400 hover:underline text-sm"
            >
              Forgot Password?
            </button>
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg transition-all duration-200 font-semibold transform hover:scale-105 active:scale-95"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Social Sign-In Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            className="w-full px-4 py-2 md:px-6 md:py-3 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded-xl shadow-lg transition-all duration-200 font-semibold border border-gray-300 dark:border-gray-600 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={() => handleSocialSignIn("github")}
            disabled={socialLoading !== null}
          >
            {socialLoading === "github" ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Signing in with GitHub...
              </div>
            ) : (
              "Sign in with GitHub"
            )}
          </button>

          <button
            className="w-full px-4 py-2 md:px-6 md:py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg transition-all duration-200 font-semibold border border-red-300 dark:border-red-600 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={() => handleSocialSignIn("google")}
            disabled={socialLoading !== null}
          >
            {socialLoading === "google" ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Signing in with Google...
              </div>
            ) : (
              "Sign in with Google"
            )}
          </button>
        </div>

        <div className="text-center mt-6 text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <button onClick={() => handleNavigation("/signup")} className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline transition-colors">
            Sign Up
          </button>
        </div>
      </div>
    </main>
  );
}
