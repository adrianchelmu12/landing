"use client";

import { SignUpButton } from "@clerk/nextjs";

const plans = [
  {
    name: "Starter",
    price: "Gratuit",
    desc: "Pentru agenți mici care vor să înceapă.",
    features: [
      "Până la 50 de proprietăți",
      "Până la 100 de clienți",
      "Pipeline vânzări de bază",
      "Programări",
      "Suport email",
    ],
    cta: "Începe gratuit",
    highlight: false,
    signUp: true,
  },
  {
    name: "Profesional",
    price: "29 €",
    period: "/lună",
    desc: "Pentru agenții în creștere cu nevoi avansate.",
    features: [
      "Proprietăți nelimitate",
      "Clienți nelimitați",
      "Pipeline avansat cu analytics",
      "Documente și comisioane",
      "Campanii marketing",
      "AI Assistant",
      "Suport prioritar",
    ],
    cta: "Începe trial gratuit",
    highlight: true,
    signUp: true,
  },
  {
    name: "Enterprise",
    price: "Personalizat",
    desc: "Pentru agenții mari cu cerințe specifice.",
    features: [
      "Tot din Profesional",
      "Harta interactivă",
      "API access",
      "White label",
      "Manager dedicat",
      "Onboarding personalizat",
    ],
    cta: "Contactează-ne",
    highlight: false,
    signUp: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Prețuri simple,{" "}
            <span className="text-primary">fără surprize</span>
          </h2>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            Alege planul potrivit pentru agenția ta. Fără costuri ascunse, upgrade oricând.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlight
                  ? "bg-primary text-white ring-2 ring-primary shadow-xl scale-[1.02]"
                  : "bg-white border border-border"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold bg-accent text-foreground">
                  Cel mai popular
                </span>
              )}

              <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className={`text-sm ${plan.highlight ? "text-white/70" : "text-muted"}`}>
                    {plan.period}
                  </span>
                )}
              </div>
              <p className={`text-sm mb-6 ${plan.highlight ? "text-white/80" : "text-muted"}`}>
                {plan.desc}
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={plan.highlight ? "text-accent shrink-0" : "text-primary shrink-0"}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {plan.signUp ? (
                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                  <button
                    className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-colors ${
                      plan.highlight
                        ? "bg-white text-primary hover:bg-white/90"
                        : "bg-primary text-white hover:bg-primary-dark"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </SignUpButton>
              ) : (
                <a
                  href="mailto:contact@imobify.ro"
                  className={`block text-center py-3 rounded-xl text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? "bg-white text-primary hover:bg-white/90"
                      : "bg-primary text-white hover:bg-primary-dark"
                  }`}
                >
                  {plan.cta}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
