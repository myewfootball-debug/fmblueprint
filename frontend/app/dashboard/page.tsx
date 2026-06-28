"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

type Tactic = {
  _id: string;
  name: string;
  formation: string;
  description: string;
  isPremium?: boolean;
  downloads?: number;
  createdAt?: string;
};

export default function DashboardPage() {
  const { user, token, isAuthenticated } = useAuth();
  const [userTactics, setUserTactics] = useState<Tactic[]>([]);
  const [stats, setStats] = useState({ tactics: 0, comments: 0, downloads: 0 });
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Tactic[]>([]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchDashboardData();
      fetchFavorites();
    }
  }, [isAuthenticated, token]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tactics");
      if (res.ok) {
        const allTactics = await res.json();
        const userTactics = allTactics.filter(
          (t: any) => t.author === user?.name || t.author === user?.email
        );
        setUserTactics(userTactics);
        setStats({
          tactics: userTactics.length,
          comments: 0,
          downloads: userTactics.reduce((sum: number, t: any) => sum + (t.downloads || 0), 0)
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Please Login</h1>
            <p className="text-slate-400 mb-6">You need to be logged in to view your dashboard</p>
            <Link href="/login" className="bg-emerald-400 text-slate-950 px-6 py-3 rounded-lg font-bold hover:bg-emerald-300 transition">
              Login
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-400" />
            <p className="mt-4 text-slate-400">Loading dashboard...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">👤 Dashboard</h1>
            <Link href="/add-tactic" className="bg-emerald-400 text-slate-950 px-4 py-2 rounded-lg font-bold hover:bg-emerald-300 transition">
              + Add Tactic
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-slate-400 text-sm">📊 My Tactics</h3>
              <p className="text-3xl font-bold mt-1">{stats.tactics}</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-slate-400 text-sm">💬 Comments</h3>
              <p className="text-3xl font-bold mt-1">{stats.comments}</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-slate-400 text-sm">📥 Total Downloads</h3>
              <p className="text-3xl font-bold mt-1">{stats.downloads}</p>
            </div>
          </div>

          {/* Favorites Section */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 mb-8">
            <h2 className="text-xl font-bold mb-4">❤️ Your Favorites</h2>
            {favorites.length === 0 ? (
              <p className="text-slate-400">No favorites yet. Browse tactics and save your favorites!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {favorites.map((tactic) => (
                  <Link href={`/tactics/${tactic._id}`} key={tactic._id} className="block p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition">
                    <span className="font-medium">{tactic.name}</span>
                    <span className="text-xs text-slate-400 ml-2">{tactic.formation}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* My Tactics */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-bold mb-4">📋 My Tactics</h2>
            {userTactics.length === 0 ? (
              <p className="text-slate-400">You haven't uploaded any tactics yet.</p>
            ) : (
              <div className="space-y-2">
                {userTactics.map((tactic) => (
                  <Link href={`/tactics/${tactic._id}`} key={tactic._id} className="block p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition flex justify-between items-center">
                    <div>
                      <span className="font-medium">{tactic.name}</span>
                      <span className="text-xs text-slate-400 ml-2">{tactic.formation}</span>
                    </div>
                    <span className="text-xs text-slate-500">📥 {tactic.downloads || 0}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}