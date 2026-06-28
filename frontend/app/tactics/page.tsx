"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";

type Tactic = {
  _id: string;
  name: string;
  formation: string;
  description: string;
  fileUrl?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function TacticsPage() {
  const [tactics, setTactics] = useState<Tactic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/tactics`)
      .then(res => res.json())
      .then(data => {
        setTactics(data.filter((t: Tactic) => t.fileUrl));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-950 text-white p-8 text-center">Loading tactics...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">FM Tactics</h1>
          <Link href="/add-tactic" className="bg-emerald-400 px-4 py-2 rounded text-slate-950 font-bold inline-block mb-6">+ Add Tactic</Link>
          {tactics.length === 0 ? (
            <p>No tactics uploaded yet.</p>
          ) : (
            <div className="space-y-4">
              {tactics.map(t => (
                <div key={t._id} className="bg-slate-900 p-4 rounded border border-slate-800">
                  <h2 className="text-xl font-bold">{t.name}</h2>
                  <p className="text-slate-400">{t.formation}</p>
                  <Link href={`/tactics/${t._id}`} className="text-emerald-400 hover:underline">View</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
