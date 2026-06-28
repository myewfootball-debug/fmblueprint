"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for trying things out",
      features: [
        "Browse all tactics",
        "View tactic details",
        "Search and filter",
        "Leave comments"
      ],
      button: "Get Started",
      href: "/register",
      popular: false
    },
    {
      name: "Pro",
      price: "$5/mo",
      description: "For serious FM players",
      features: [
        "Everything in Free",
        "Upload unlimited tactics",
        "Download any tactic",
        "Premium tactic access",
        "Priority support"
      ],
      button: "Upgrade Now",
      href: "/register",
      popular: true
    },
    {
      name: "Premium",
      price: "$15/mo",
      description: "For FM enthusiasts and creators",
      features: [
        "Everything in Pro",
        "Exclusive early access",
        "Custom tactic requests",
        "Featured tactic slot",
        "1-on-1 coaching",
        "Ad-free experience"
      ],
      button: "Go Premium",
      href: "/register",
      popular: false
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Choose the plan that works for you. All plans include access to our growing library of FM tactics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-slate-900 p-8 rounded-2xl border transition hover:scale-[1.02] ${
                  plan.popular
                    ? "border-emerald-400 shadow-lg shadow-emerald-400/10"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-400 text-slate-950 px-4 py-1 rounded-full text-xs font-bold">
                    Most Popular
                  </span>
                )}

                <h2 className="text-2xl font-bold">{plan.name}</h2>
                <p className="text-3xl font-bold mt-2">{plan.price}</p>
                <p className="text-slate-400 text-sm mt-1">{plan.description}</p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-slate-300">
                      <span className="text-emerald-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`w-full block text-center mt-8 py-3 rounded-xl font-bold transition ${
                    plan.popular
                      ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                      : "bg-slate-800 text-white hover:bg-slate-700"
                  }`}
                >
                  {plan.button}
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 text-slate-500 text-sm">
            <p>All plans include a 30-day money-back guarantee.</p>
            <p className="mt-1">Questions? Contact us at <a href="mailto:support@fmblueprint.com" className="text-emerald-400 hover:underline">support@fmblueprint.com</a></p>
          </div>
        </div>
      </main>
    </>
  );
}