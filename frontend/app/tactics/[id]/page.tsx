"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

type Tactic = {
  _id: string;
  name: string;
  formation: string;
  description: string;
  fileUrl?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function TacticDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tactic, setTactic] = useState<Tactic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/tactics/${id}`)
      .then(res => res.json())
      .then(data => {
        setTactic(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-950 text-white p-8 text-center">Loading...</div>
    </>
  );

  if (!tactic) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-950 text-white p-8 text-center">
        <h1 className="text-3xl">Tactic Not Found</h1>
        <button onClick={() => router.push("/tactics")} className="mt-4 bg-emerald-400 px-4 py-2 rounded text-slate-950">Back</button>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.push("/tactics")} className="text-slate-400 hover:text-white mb-6">← Back</button>
          <div className="bg-slate-900 p-8 rounded border border-slate-800">
            <h1 className="text-4xl font-bold">{tactic.name}</h1>
            <p className="text-slate-400 mt-2">{tactic.formation}</p>
            <p className="mt-6">{tactic.description}</p>
            {tactic.fileUrl && (
              <a href={`${API_URL}${tactic.fileUrl}`} download className="mt-6 inline-block bg-emerald-400 px-6 py-3 rounded text-slate-950 font-bold">
                📥 Download
              </a>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
