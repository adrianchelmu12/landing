"use client";

import { SignUpButton } from "@clerk/nextjs";

export default function Hero() {
  return (
    <section className="relative pt-36 pb-24 px-4 sm:px-6 lg:px-8 overflow-x-clip">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/40 to-amber-50/30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-blue-400/[0.04] rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <div className="text-center lg:text-left">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-6">
              Lansare în curând
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Platforma completă pentru{" "}
              <span className="text-primary">agenția ta imobiliară</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted max-w-xl lg:max-w-none leading-relaxed">
              Gestionare proprietăți, clienți, pipeline vânzări, programări și analytics
              — totul într-un singur loc. Simplu, rapid, fără bătăi de cap.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center lg:items-start gap-4">
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-primary text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                  Încearcă gratuit
                </button>
              </SignUpButton>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold border border-border text-foreground hover:bg-card transition-colors"
              >
                Vezi funcționalități
              </a>
            </div>

            <p className="mt-6 text-sm text-muted">
              Fără card de credit • 14 zile trial gratuit • Anulezi oricând
            </p>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-gray-200 shadow-2xl shadow-black/[0.08] overflow-hidden bg-white p-2">
              <img
                src="/prezentaregenerala.png"
                alt="Prezentare generala CRM Imobify"
                className="rounded-xl w-full"
              />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/10 via-transparent to-amber-400/10 rounded-3xl blur-xl -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
}
