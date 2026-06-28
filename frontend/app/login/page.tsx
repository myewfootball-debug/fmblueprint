"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to tactics
  if (isAuthenticated) {
    router.push("/tactics");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await login(email, password);
      router.push("/tactics");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <h1 className="text-3xl font-bold mb-6">Login</h1>
          {error && <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="w-full rounded-xl bg-emerald-400 py-3 font-bold text-slate-950 hover:bg-emerald-300 disabled:opacity-50 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-4 text-slate-400">
            Don't have an account? <a href="/register" className="text-emerald-400 hover:underline">Register</a>
          </p>
        </div>
      </main>
    </>
  );
}