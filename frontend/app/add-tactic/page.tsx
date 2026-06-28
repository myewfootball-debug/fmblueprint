"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AddTacticPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [formation, setFormation] = useState("4-3-3");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError("Please select a file");
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/tactics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, formation, description, author: "Anonymous" })
      });
      if (!res.ok) throw new Error("Failed to create tactic");
      const tactic = await res.json();

      const formData = new FormData();
      formData.append("tacticFile", file);
      const uploadRes = await fetch(`${API_URL}/api/upload/tactic-file/${tactic._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!uploadRes.ok) throw new Error("Failed to upload file");

      router.push("/tactics");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Add Tactic</h1>
          {error && <div className="bg-red-500/20 p-3 rounded mb-4 text-red-400">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="file" accept=".fmf,.fmnf" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full bg-slate-900 p-3 rounded border border-slate-800" required />
            <input type="text" placeholder="Tactic Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-900 p-3 rounded border border-slate-800" required />
            <input type="text" placeholder="Formation" value={formation} onChange={e => setFormation(e.target.value)} className="w-full bg-slate-900 p-3 rounded border border-slate-800" required />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full bg-slate-900 p-3 rounded border border-slate-800" required />
            <button type="submit" disabled={loading} className="w-full bg-emerald-400 p-3 rounded text-slate-950 font-bold hover:bg-emerald-300 disabled:opacity-50">
              {loading ? "Uploading..." : "Upload Tactic"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
