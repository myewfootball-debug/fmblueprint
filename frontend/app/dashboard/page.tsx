"use client";

import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-950 text-white p-8 text-center">
          <h1 className="text-3xl">Please Login</h1>
          <a href="/login" className="mt-4 inline-block bg-emerald-400 px-6 py-2 rounded text-slate-950">Login</a>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <div className="bg-slate-900 p-6 rounded border border-slate-800">
            <p>Welcome back, {user?.name}!</p>
            <p className="text-slate-400 text-sm mt-2">{user?.email}</p>
          </div>
        </div>
      </main>
    </>
  );
}
