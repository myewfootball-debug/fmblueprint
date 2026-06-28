"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthenticated) {
    router.push("/tactics");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password);
      router.push("/tactics");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6">Register</h1>
          {error && <div className="bg-red-500/20 p-3 rounded mb-4 text-red-400">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-900 p-3 rounded border border-slate-800" required />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900 p-3 rounded border border-slate-800" required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900 p-3 rounded border border-slate-800" required />
            <button type="submit" className="w-full bg-emerald-400 p-3 rounded text-slate-950 font-bold hover:bg-emerald-300">Register</button>
          </form>
          <p className="mt-4 text-slate-400">Already have an account? <a href="/login" className="text-emerald-400">Login</a></p>
        </div>
      </main>
    </>
  );
}
