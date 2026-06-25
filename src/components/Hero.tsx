"use client";

import { SignUpButton } from "@clerk/nextjs";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-amber-50" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto text-center">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-6">
          Lansare în curând
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
          Platforma completă pentru{" "}
          <span className="text-primary">agenția ta imobiliară</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
          Gestionare proprietăți, clienți, pipeline vânzări, programări și analytics
          — totul într-un singur loc. Simplu, rapid, fără bătăi de cap.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
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
    </section>
  );
}
