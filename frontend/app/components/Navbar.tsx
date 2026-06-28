"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <nav className="border-b border-slate-800 bg-slate-900/50 p-4">
        <div className="max-w-7xl mx-auto flex justify-between">
          <span className="text-xl font-bold text-emerald-400">⚽ FM Blueprint</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/tactics" className="text-xl font-bold text-emerald-400">
          ⚽ FM Blueprint
        </Link>
        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-300">👋 {user?.name}</span>
              <button onClick={logout} className="text-red-400 hover:text-red-300">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-300 hover:text-white">Login</Link>
              <Link href="/register" className="bg-emerald-400 px-4 py-2 rounded text-slate-950 font-bold hover:bg-emerald-300">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
