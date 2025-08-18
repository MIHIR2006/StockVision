"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"github" | "google" | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
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
        callbackUrl: "/dashboard"
      });
      
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
      <main className="flex flex-col items-center justify-center min-h-screen bg-background/80">
        <div className="w-full max-w-md mx-auto mt-20 p-8 bg-white/5 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/10">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-white/80 mt-4">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background/80">
      <div className="w-full max-w-md mx-auto mt-20 p-8 bg-white/5 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/10">
        <h1 className="text-3xl font-bold text-center text-white mb-8 drop-shadow-lg">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm"
              required
            />
          </div>
          {error && <div className="text-red-400 text-sm text-center bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">{error}</div>}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg transition-all duration-200 font-semibold transform hover:scale-105 active:scale-95"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="flex flex-col gap-3 mt-8">
          <button
            className="w-full px-6 py-3 bg-black/60 hover:bg-black/80 text-white rounded-xl shadow-lg transition-all duration-200 font-semibold border border-white/10 backdrop-blur-sm transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
            className="w-full px-6 py-3 bg-red-600/80 hover:bg-red-700/90 text-white rounded-xl shadow-lg transition-all duration-200 font-semibold border border-white/10 backdrop-blur-sm transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
        <div className="text-center mt-6 text-white/80">
          Don't have an account? <button onClick={() => handleNavigation("/signup")} className="text-blue-400 hover:text-blue-300 underline transition-colors">Sign Up</button>
        </div>
      </div>
    </main>
  );
}
