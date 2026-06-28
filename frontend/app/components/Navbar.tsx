"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Show loading state
  if (loading) {
    return (
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/tactics" className="text-xl font-bold text-emerald-400">
            ⚽ FM Blueprint
          </Link>
          <div className="flex items-center gap-4">
            <div className="h-8 w-20 animate-pulse rounded bg-slate-800" />
            <div className="h-8 w-20 animate-pulse rounded bg-slate-800" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/tactics" className="text-xl font-bold text-emerald-400">
          ⚽ FM Blueprint
        </Link>
        
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Link
              href="/add-tactic"
              className="rounded-xl bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-400 hover:bg-emerald-400/20 transition"
            >
              + Add Tactic
            </Link>
          )}
          
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-300 flex items-center gap-2">
                <span className="text-emerald-400">●</span>
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}