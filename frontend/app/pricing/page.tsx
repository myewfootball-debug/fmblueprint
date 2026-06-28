"use client";

import Navbar from "../components/Navbar";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Pricing</h1>
          <p className="text-slate-400 mb-8">Choose a plan that works for you</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded border border-slate-800">
              <h2 className="text-2xl font-bold">Free</h2>
              <p className="text-3xl font-bold mt-2">$0</p>
              <ul className="mt-4 text-slate-400 space-y-2">
                <li>✓ View tactics</li>
                <li>✓ Limited downloads</li>
              </ul>
              <button className="mt-6 w-full bg-slate-800 p-2 rounded">Get Started</button>
            </div>
            <div className="bg-slate-900 p-6 rounded border border-emerald-400">
              <h2 className="text-2xl font-bold">Pro</h2>
              <p className="text-3xl font-bold mt-2">$5/mo</p>
              <ul className="mt-4 text-slate-400 space-y-2">
                <li>✓ Unlimited tactics</li>
                <li>✓ Unlimited downloads</li>
              </ul>
              <button className="mt-6 w-full bg-emerald-400 p-2 rounded text-slate-950 font-bold">Upgrade</button>
            </div>
            <div className="bg-slate-900 p-6 rounded border border-slate-800">
              <h2 className="text-2xl font-bold">Premium</h2>
              <p className="text-3xl font-bold mt-2">$15/mo</p>
              <ul className="mt-4 text-slate-400 space-y-2">
                <li>✓ Everything in Pro</li>
                <li>✓ Exclusive tactics</li>
              </ul>
              <button className="mt-6 w-full bg-slate-800 p-2 rounded">Go Premium</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
