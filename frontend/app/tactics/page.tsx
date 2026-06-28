"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import StarRating from "../components/StarRating";
import FavoriteButton from "../components/FavoriteButton";
import Pagination from "../components/Pagination";

type Tactic = {
  _id: string;
  name: string;
  formation: string;
  description: string;
  isPremium?: boolean;
  author?: string;
  downloads?: number;
  createdAt?: string;
  fileUrl?: string;
  filename?: string;
  ratings?: {
    average: number;
    count: number;
  };
  favoritedBy?: string[];
};

export default function TacticsPage() {
  const [tactics, setTactics] = useState<Tactic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formation, setFormation] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchTactics();
  }, [currentPage, sortBy]);

  const fetchTactics = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/tactics?page=${currentPage}&limit=10&sort=${sortBy}`
      );
      const data = await res.json();
      
      // Handle both paginated and non-paginated responses
      if (data.tactics) {
        const tacticsWithFiles = data.tactics.filter((t: Tactic) => t.fileUrl);
        setTactics(tacticsWithFiles);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalItems(data.pagination?.totalItems || tacticsWithFiles.length);
      } else {
        // Fallback for non-paginated response
        const tacticsWithFiles = data.filter((t: Tactic) => t.fileUrl);
        setTactics(tacticsWithFiles);
        setTotalPages(Math.ceil(tacticsWithFiles.length / 10));
        setTotalItems(tacticsWithFiles.length);
      }
    } catch (error) {
      console.error("Failed to fetch tactics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique formations for filter
  const formations = ["All", ...new Set(tactics.map((t) => t.formation))];

  const filteredTactics = tactics.filter((tactic) => {
    const matchesSearch =
      tactic.name.toLowerCase().includes(search.toLowerCase()) ||
      tactic.description.toLowerCase().includes(search.toLowerCase());
    const matchesFormation =
      formation === "All" || tactic.formation === formation;
    return matchesSearch && matchesFormation;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Football Manager 2026 Tactics</h1>
              <p className="text-sm text-slate-500 mt-1">
                {totalItems} tactics available for download
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-400"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Downloaded</option>
                <option value="top-rated">Top Rated</option>
              </select>
              <Link
                href="/add-tactic"
                className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300 transition"
              >
                + Add Tactic
              </Link>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Search tactics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400 text-sm"
            />
            <div className="flex flex-wrap gap-2">
              {formations.map((f) => (
                <button
                  key={f}
                  onClick={() => setFormation(f)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    formation === f
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 text-xs font-semibold text-slate-500 border-b border-slate-800">
            <div className="col-span-4">Tactic</div>
            <div className="col-span-2 text-center">Formation</div>
            <div className="col-span-2 text-center">Rating</div>
            <div className="col-span-1 text-center">Downloads</div>
            <div className="col-span-1 text-center">Premium</div>
            <div className="col-span-1 text-center">❤️</div>
            <div className="col-span-1 text-right">Added</div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="space-y-2 mt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse rounded-lg bg-slate-900 p-4">
                  <div className="h-5 w-3/4 rounded bg-slate-800" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-slate-800" />
                </div>
              ))}
            </div>
          ) : filteredTactics.length === 0 ? (
            <div className="mt-8 text-center text-slate-400">
              {tactics.length === 0 ? (
                <>
                  <p className="text-lg">No tactics available yet</p>
                  <p className="text-sm mt-2">Be the first to upload a tactic!</p>
                  <Link
                    href="/add-tactic"
                    className="inline-block mt-4 rounded-lg bg-emerald-400 px-6 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300 transition"
                  >
                    Upload a Tactic
                  </Link>
                </>
              ) : (
                <>
                  <p>No tactics match your search</p>
                  <button
                    onClick={() => { setSearch(""); setFormation("All"); }}
                    className="mt-2 text-emerald-400 hover:underline"
                  >
                    Clear filters
                  </button>
                </>
              )}
            </div>
          ) : (
            /* Tactic List */
            <div className="mt-2 space-y-1">
              {filteredTactics.map((tactic) => (
                <div key={tactic._id} className="group">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 px-4 py-3 rounded-lg bg-slate-900/50 hover:bg-slate-800 transition border border-transparent hover:border-slate-700">
                    {/* Tactic Name */}
                    <Link href={`/tactics/${tactic._id}`} className="col-span-4 block">
                      <div className="font-medium text-white group-hover:text-emerald-400 transition">
                        {tactic.name}
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-1">
                        {tactic.description}
                      </div>
                      {tactic.author && (
                        <div className="text-xs text-slate-600 mt-0.5">
                          by {tactic.author}
                        </div>
                      )}
                    </Link>

                    {/* Formation */}
                    <div className="col-span-2 flex items-center justify-start md:justify-center">
                      <span className="text-xs font-medium text-slate-300 bg-slate-800 px-2 py-1 rounded">
                        {tactic.formation}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="col-span-2 flex items-center justify-start md:justify-center">
                      <StarRating
                        rating={tactic.ratings?.average || 0}
                        readonly
                        size="sm"
                        count={tactic.ratings?.count || 0}
                      />
                    </div>

                    {/* Downloads */}
                    <div className="col-span-1 flex items-center justify-start md:justify-center">
                      <span className="text-sm text-slate-400">
                        📥 {tactic.downloads || 0}
                      </span>
                    </div>

                    {/* Premium */}
                    <div className="col-span-1 flex items-center justify-start md:justify-center">
                      {tactic.isPremium ? (
                        <span className="text-xs font-bold text-yellow-400">⭐</span>
                      ) : (
                        <span className="text-xs text-slate-600">Free</span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <div className="col-span-1 flex items-center justify-start md:justify-center">
                      <FavoriteButton tacticId={tactic._id} />
                    </div>

                    {/* Date */}
                    <div className="col-span-1 flex items-center justify-start md:justify-end text-xs text-slate-500">
                      {formatDate(tactic.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredTactics.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}

          {/* Footer Stats */}
          {filteredTactics.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-xs text-slate-600 border-t border-slate-800 pt-4">
              <span>{filteredTactics.length} tactics</span>
              <span>Showing {filteredTactics.length} of {totalItems}</span>
            </div>
          )}
        </div>
      </main>
    </>
  );
}