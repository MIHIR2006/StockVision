"use client";
import {
  Eye,
  EyeClosed,
  Moon,
  Sun,
  StepBack,
  Mail,
  Lock,
  Github,
  Chrome,
  UserPlus,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BackgroundGradientAnimation } from "../../components/ui/background-gradient-animation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    "github" | "google" | null
  >(null);
  const [isDark, setIsDark] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Password rules state
  const [passwordRules, setPasswordRules] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  // Detect initial theme on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDarkMode =
        window.document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    }
  }, []);

  // Update password rules on change
  useEffect(() => {
    setPasswordRules({
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

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
        callbackUrl: "/dashboard",
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
      <main className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
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
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 dark:border-purple-900 border-t-purple-600 dark:border-t-purple-400 mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            Loading...
          </p>
        </div>
      </main>
    );
  }

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
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

      {/* Decorative Elements for Light Mode */}
      <div className="absolute inset-0 z-0 dark:opacity-0 opacity-100 transition-opacity duration-300">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl"></div>
      </div>

      <button
        onClick={() => router.push("/")}
        className="absolute z-20 top-6 left-6 p-3 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
        aria-label="Back to landing page"
      >
        <StepBack className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </button>

      <button
        onClick={toggleTheme}
        className="absolute z-20 top-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : (
          <Moon className="h-5 w-5 text-purple-600" />
        )}
      </button>

      <div className="relative z-10 w-full max-w-md mx-auto my-8 p-6 md:p-8 bg-white dark:bg-gray-800 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[calc(100vh-4rem)] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mb-3 shadow-lg">
            <UserPlus className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xs">
            Join us to start your investment journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
            </div>
            <input
              type="email"
              autoComplete="off"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-200"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-11 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200"
            >
              {showPassword ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeClosed className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Password Policy Checklist - Improved */}
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-2.5 space-y-1">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Password must contain:
            </p>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                {passwordRules.minLength ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
                )}
                <span
                  className={`text-xs ${
                    passwordRules.minLength
                      ? "text-green-600 dark:text-green-500 font-medium"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {passwordRules.uppercase ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
                )}
                <span
                  className={`text-xs ${
                    passwordRules.uppercase
                      ? "text-green-600 dark:text-green-500 font-medium"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  One uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {passwordRules.lowercase ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
                )}
                <span
                  className={`text-xs ${
                    passwordRules.lowercase
                      ? "text-green-600 dark:text-green-500 font-medium"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  One lowercase letter (a-z)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {passwordRules.number ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
                )}
                <span
                  className={`text-xs ${
                    passwordRules.number
                      ? "text-green-600 dark:text-green-500 font-medium"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  One number (0-9)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {passwordRules.specialChar ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
                )}
                <span
                  className={`text-xs ${
                    passwordRules.specialChar
                      ? "text-green-600 dark:text-green-500 font-medium"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  One special character (!@#$%...)
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl border-2 border-red-200 dark:border-red-800">
              <div className="flex-shrink-0">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2.5 text-sm bg-gradient-to-r from-purple-500 via-pink-500 to-pink-600 hover:from-purple-600 hover:via-pink-600 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/40 hover:shadow-lg hover:shadow-pink-600/45 transition-all duration-200 transform hover:scale-[1.01] active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg disabled:hover:from-purple-500 disabled:hover:via-pink-500 disabled:hover:to-pink-600 flex items-center justify-center gap-2"
            disabled={loading || !isPasswordValid}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Create Account
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
              Or sign up with
            </span>
          </div>
        </div>

        {/* Social sign-in buttons */}
        <div className="flex gap-3">
          <button
            className="flex-1 px-3 py-2.5 text-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold border-2 border-gray-300 dark:border-gray-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            type="button"
            onClick={() => handleSocialSignIn("github")}
            disabled={socialLoading !== null}
          >
            {socialLoading === "github" ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white"></div>
                <span className="hidden sm:inline">Signing up...</span>
              </>
            ) : (
              <>
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
              </>
            )}
          </button>
          <button
            className="flex-1 px-3 py-2.5 text-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold border-2 border-gray-300 dark:border-gray-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            type="button"
            onClick={() => handleSocialSignIn("google")}
            disabled={socialLoading !== null}
          >
            {socialLoading === "google" ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white"></div>
                <span className="hidden sm:inline">Signing up...</span>
              </>
            ) : (
              <>
                <Chrome className="h-4 w-4" />
                <span className="hidden sm:inline">Google</span>
              </>
            )}
          </button>
        </div>

        {/* Login Link */}
        <div className="text-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-xs">
            Already have an account?{" "}
            <button
              onClick={() => handleNavigation("/login")}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
