"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#232526] via-[#414345] to-[#232526]">
      <div className="w-full max-w-md mx-auto mt-20 p-8 bg-white/10 rounded-2xl shadow-2xl backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-lg">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition font-semibold"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="flex flex-col gap-2 mt-6">
          <button
            className="px-6 py-2 bg-black hover:bg-gray-900 text-white rounded-lg shadow transition font-semibold"
            onClick={() => signIn("github")}
          >
            Sign in with GitHub
          </button>
          <button
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition font-semibold"
            onClick={() => signIn("google")}
          >
            Sign in with Google
          </button>
        </div>
        <div className="text-center mt-4 text-white/80">
          Don't have an account? <a href="/signup" className="text-blue-400 underline">Sign Up</a>
        </div>
      </div>
    </main>
  );
}
