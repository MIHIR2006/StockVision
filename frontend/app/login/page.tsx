"use client";
import { Eye, EyeClosed, Moon, StepBack, Sun, Mail, Lock, Github, Chrome, LogIn as LoginIcon } from "lucide-react";
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
      <main className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <div className="absolute inset-0 z-0 dark:opacity-100 opacity-0">
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

        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      {/* Background Gradient Animation - Only visible in dark mode */}
      <div className="absolute inset-0 z-0 dark:opacity-100 opacity-0 transition-opacity duration-300">
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
        className="absolute z-20 top-6 left-6 p-3 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
        aria-label="Back to landing page"
      >
        <StepBack className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute z-20 top-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-indigo-600" />}
      </button>

      <div className="relative z-10 w-full max-w-md mx-auto my-8 p-6 md:p-8 bg-white dark:bg-gray-800 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 min-h-[200px]">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-3 shadow-lg">
            <LoginIcon className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xs">
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-3">
            {/* Email Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-11 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
              >
                {showPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeClosed className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl border-2 border-red-200 dark:border-red-800">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2.5 text-sm bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Signing in...
              </>
            ) : (
              <>
                <LoginIcon className="h-4 w-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Sign-In Buttons */}
        <div className="flex gap-3">
          <button
            className="flex-1 px-3 py-2.5 text-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold border-2 border-gray-300 dark:border-gray-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            onClick={() => handleSocialSignIn("github")}
            disabled={socialLoading !== null}
          >
            {socialLoading === "github" ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white"></div>
            ) : (
              <>
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
              </>
            )}
          </button>

          <button
            className="flex-1 px-3 py-2.5 text-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold border-2 border-gray-300 dark:border-gray-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            onClick={() => handleSocialSignIn("google")}
            disabled={socialLoading !== null}
          >
            {socialLoading === "google" ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white"></div>
            ) : (
              <>
                <Chrome className="h-4 w-4" />
                <span className="hidden sm:inline">Google</span>
              </>
            )}
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-xs">
            Don't have an account?{" "}
            <button
              onClick={() => handleNavigation("/signup")}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
