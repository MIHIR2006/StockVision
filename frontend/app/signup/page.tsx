"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#232526] via-[#414345] to-[#232526]">
      <div className="w-full max-w-md mx-auto mt-20 p-8 bg-white/10 rounded-2xl shadow-2xl backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-lg">Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            autoComplete="off"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            autoComplete="off"
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
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="flex flex-col gap-2 mt-6">
          <button
            className="px-6 py-2 bg-black hover:bg-gray-900 text-white rounded-lg shadow transition font-semibold"
            type="button"
            onClick={() => signIn("github")}
          >
            Sign up with GitHub
          </button>
          <button
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition font-semibold"
            type="button"
            onClick={() => signIn("google")}
          >
            Sign up with Google
          </button>
        </div>
        <div className="text-center mt-4 text-white/80">
          Already have an account? <a href="/login" className="text-blue-400 underline">Login</a>
        </div>
      </div>
    </main>
  );
}
