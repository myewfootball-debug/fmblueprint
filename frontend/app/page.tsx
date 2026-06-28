import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6">⚽ FM Blueprint</h1>
        <p className="text-xl text-slate-300 mb-4">
          Your ultimate Football Manager tactics library
        </p>
        <p className="text-slate-400 mb-8">
          Discover, share, and save winning formations
        </p>
        <Link
          href="/tactics"
          className="inline-block rounded-xl bg-emerald-400 px-8 py-4 font-bold text-slate-950 hover:bg-emerald-300 transition"
        >
          Browse Tactics →
        </Link>
      </div>
    </main>
  );
}