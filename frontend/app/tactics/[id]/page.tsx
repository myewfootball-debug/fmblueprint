"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

type Tactic = {
  _id: string;
  name: string;
  formation: string;
  description: string;
  isPremium?: boolean;
  createdAt?: string;
  filename?: string;
  fileUrl?: string;
  downloads?: number;
  author?: string;
  images?: string[];
};

type Comment = {
  _id: string;
  tacticId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
};

export default function TacticDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();
  const [tactic, setTactic] = useState<Tactic | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTactic() {
      try {
        const res = await fetch(`http://localhost:5000/api/tactics/${id}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setTactic(data);
        setDownloadCount(data.downloads || 0);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchTactic();
  }, [id]);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`http://localhost:5000/api/comments/${id}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
    if (id) fetchComments();
  }, [id]);

  const handleDownload = async () => {
    if (!tactic?.fileUrl) return;

    try {
      const res = await fetch(`http://localhost:5000/api/tactics/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ downloads: (downloadCount || 0) + 1 }),
      });

      if (res.ok) {
        setDownloadCount(downloadCount + 1);
      }
    } catch (error) {
      console.error("Error updating download count:", error);
    }

    window.open(`http://localhost:5000${tactic.fileUrl}`, "_blank");
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!newComment.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:5000/api/comments/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: newComment })
      });

      if (!res.ok) {
        throw new Error("Failed to add comment");
      }

      const comment = await res.json();
      setComments([comment, ...comments]);
      setNewComment("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        setComments(comments.filter(c => c._id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`http://localhost:5000/api/upload/image/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      setTactic(prev => prev ? { ...prev, images: data.images } : null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/upload/image/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ imageUrl })
      });

      if (res.ok) {
        const data = await res.json();
        setTactic(prev => prev ? { ...prev, images: data.images } : null);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-400" />
            <p className="mt-4 text-slate-400">Loading tactic...</p>
          </div>
        </main>
      </>
    );
  }

  if (notFound || !tactic) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Tactic Not Found</h1>
            <p className="mt-3 text-slate-400">This tactic doesn't exist or was removed.</p>
            <button
              onClick={() => router.push("/tactics")}
              className="mt-6 rounded-xl bg-emerald-400 px-6 py-3 font-bold text-slate-950 hover:bg-emerald-300"
            >
              Back to Tactics
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          {/* Back button */}
          <button
            onClick={() => router.push("/tactics")}
            className="mb-8 flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition"
          >
            ← Back to Tactics
          </button>

          {/* Tactic Header */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="rounded-full bg-emerald-400/10 px-4 py-1.5 text-sm font-bold text-emerald-400">
                {tactic.formation}
              </span>
              <span className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                tactic.isPremium ? "bg-yellow-400 text-slate-950" : "bg-slate-800 text-slate-300"
              }`}>
                {tactic.isPremium ? "⭐ Premium" : "Free"}
              </span>
              {tactic.author && (
                <span className="text-sm text-slate-400">
                  By {tactic.author}
                </span>
              )}
              {tactic.createdAt && (
                <span className="text-xs text-slate-500">
                  Added {formatDate(tactic.createdAt)}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold md:text-5xl">{tactic.name}</h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              {tactic.description}
            </p>
          </div>

          {/* Images Section */}
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Tactic Screenshots</h2>
              {isAuthenticated && (
                <label className="cursor-pointer rounded-lg bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-400 hover:bg-emerald-400/20 transition">
                  {uploadingImage ? "Uploading..." : "+ Add Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              )}
            </div>
            
            {tactic.images && tactic.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {tactic.images.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={`http://localhost:5000${imageUrl}`}
                      alt={`Tactic screenshot ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-slate-700"
                    />
                    {isAuthenticated && (
                      <button
                        onClick={() => handleDeleteImage(imageUrl)}
                        className="absolute top-2 right-2 rounded-full bg-red-500/80 p-1.5 opacity-0 group-hover:opacity-100 transition hover:bg-red-500"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No images uploaded yet</p>
            )}
          </div>

          {/* Download button */}
          {tactic.fileUrl && (
            <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-lg font-bold">📥 Download Tactic File</h3>
                  <p className="text-sm text-slate-400">
                    Download the .fmf file to import into Football Manager
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    📊 {downloadCount} downloads
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="rounded-xl bg-emerald-400 px-6 py-3 font-bold text-slate-950 hover:bg-emerald-300 transition"
                >
                  Download
                </button>
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold mb-4">💬 Comments</h2>
            
            {isAuthenticated ? (
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white outline-none focus:border-emerald-400 text-sm"
                    required
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-emerald-400 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-300 disabled:opacity-50 transition"
                  >
                    {submitting ? "Sending..." : "Post"}
                  </button>
                </div>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              </form>
            ) : (
              <p className="text-slate-400 mb-6">
                <a href="/login" className="text-emerald-400 hover:underline">Login</a> to comment
              </p>
            )}

            {comments.length === 0 ? (
              <p className="text-slate-500 text-sm">No comments yet. Be the first!</p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="border-b border-slate-800 pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-emerald-400">
                          {comment.userName}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      {isAuthenticated && user?.id === comment.userId && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-xs text-red-400 hover:text-red-300 transition"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-slate-300 mt-1 text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA section */}
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-8 text-center">
            <h2 className="text-2xl font-bold">Want to use this tactic?</h2>
            <p className="mt-2 text-slate-400">Create a free account to save tactics and access premium setups.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href="/register"
                className="rounded-xl bg-emerald-400 px-8 py-3 font-bold text-slate-950 hover:bg-emerald-300 transition text-center"
              >
                Sign Up Free
              </a>
              <button className="rounded-xl border border-slate-700 px-8 py-3 font-bold text-white hover:border-emerald-400 transition">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}