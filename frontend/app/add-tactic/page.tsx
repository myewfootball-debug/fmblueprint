"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function AddTacticPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    formation: "4-3-3",
    description: "",
    isPremium: false,
    author: "",
    customFormation: ""
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // All possible formations
  const formations = [
    // Classic formations
    "4-4-2",
    "4-4-2 Diamond",
    "4-4-2 Wide",
    "4-3-3",
    "4-3-3 Attacking",
    "4-3-3 Defensive",
    "4-2-3-1",
    "4-2-3-1 Wide",
    "4-1-2-1-2",
    "4-1-2-1-2 Wide",
    "4-1-3-2",
    "4-1-4-1",
    "4-2-2-2",
    "4-2-4",
    "4-3-1-2",
    "4-3-2-1",
    
    // 5 at the back
    "5-3-2",
    "5-3-2 WB",
    "5-4-1",
    "5-4-1 Diamond",
    "5-2-1-2",
    "5-2-2-1",
    "5-2-3",
    
    // 3 at the back
    "3-4-3",
    "3-4-1-2",
    "3-4-2-1",
    "3-5-2",
    "3-5-1-1",
    "3-1-4-2",
    "3-2-3-2",
    "3-3-1-3",
    "3-3-2-2",
    "3-3-3-1",
    
    // 2 at the back
    "2-3-5",
    "2-4-4",
    "2-5-3",
    
    // Formations with 1 at the back
    "1-4-5",
    "1-5-4",
    
    // Modern/variation formations
    "4-5-1",
    "4-5-1 Flat",
    "4-6-0",
    "3-6-1",
    "4-0-6",
    "4-1-2-3",
    "4-3-2-1 Christmas Tree",
    "4-2-3-1 Narrow",
    
    // Uncommon formations
    "4-1-2-2-1",
    "4-2-1-2-1",
    "4-2-1-3",
    "4-2-2-1-1",
    "3-4-0-3",
    "3-4-2-1",
    "3-5-1-1",
    "3-5-2 WB",
    "4-1-2-3 Wide",
    "4-2-3-0",
    "4-2-4 Narrow",
    "4-2-4 Wide",
    "4-3-2-1 Wide",
    "4-3-3 Wide",
    "4-3-3 Narrow",
    "4-4-1-1",
    "4-4-2 Narrow",
    "4-5-1 Attacking",
    "5-2-3 Wide",
    "5-3-2 Attacking",
    "5-4-1 Wide",
    
    // Historical formations
    "2-3-5 Pyramid",
    "3-2-2-3 Metodo",
    "4-3-3 Total Football",
    
    // Custom
    "Custom"
  ];

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  // Auto-populate tactic name from file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    
    if (selectedFile) {
      // Get filename without extension
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, "");
      // Auto-fill the tactic name
      setFormData(prev => ({
        ...prev,
        name: fileName
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Determine the formation value
      let formationValue = formData.formation;
      if (formData.formation === "Custom" && formData.customFormation) {
        formationValue = formData.customFormation;
      }

      // Create tactic data
      const tacticData = {
        name: formData.name,
        formation: formationValue,
        description: formData.description,
        isPremium: formData.isPremium,
        author: formData.author || "Anonymous"
      };

      // Create the tactic
      const res = await fetch("http://localhost:5000/api/tactics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(tacticData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add tactic");
      }

      const tactic = await res.json();

      // Upload file if exists
      if (file) {
        const formData = new FormData();
        formData.append("tacticFile", file);

        const uploadRes = await fetch(`http://localhost:5000/api/upload/tactic-file/${tactic._id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload tactic file");
        }
      }

      setSuccess("✅ Tactic added successfully!");
      setFormData({
        name: "",
        formation: "4-3-3",
        description: "",
        isPremium: false,
        author: "",
        customFormation: ""
      });
      setFile(null);

      setTimeout(() => router.push("/tactics"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-2xl px-6 py-10">
          <h1 className="text-3xl font-bold mb-6">Add New Tactic</h1>
          
          {error && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4">
              ❌ {error}
            </div>
          )}
          
          {success && (
            <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload - First */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Tactic File (.fmf) *
              </label>
              <input
                type="file"
                accept=".fmf"
                onChange={handleFileChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-400 file:text-slate-950 hover:file:bg-emerald-300"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Upload your Football Manager tactic file (.fmf format)
              </p>
              {file && (
                <p className="text-xs text-emerald-400 mt-1">
                  ✅ File selected: {file.name}
                </p>
              )}
            </div>

            {/* Tactic Name - Auto-filled from file, but can be edited */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Tactic Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
                placeholder="Auto-filled from filename"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Auto-filled from uploaded filename - you can edit it
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Formation *
              </label>
              <select
                value={formData.formation}
                onChange={(e) => setFormData({ ...formData, formation: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
              >
                {formations.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Custom formation input */}
            {formData.formation === "Custom" && (
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Custom Formation *
                </label>
                <input
                  type="text"
                  value={formData.customFormation}
                  onChange={(e) => setFormData({ ...formData, customFormation: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
                  placeholder="e.g., 4-1-2-1-2"
                  required={formData.formation === "Custom"}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Enter your custom formation (e.g., 4-1-2-1-2)
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
                placeholder="Your username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-400"
                placeholder="Describe your tactic, key instructions, and player requirements..."
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isPremium}
                onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-emerald-400 focus:ring-emerald-400"
              />
              <label className="text-sm font-semibold text-slate-300">
                Premium Tactic (requires payment to download)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-400 py-3 font-bold text-slate-950 hover:bg-emerald-300 disabled:opacity-50 transition"
            >
              {loading ? "Adding Tactic..." : "Add Tactic"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}