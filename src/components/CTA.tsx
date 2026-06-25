"use client";

import { SignUpButton } from "@clerk/nextjs";

export default function CTA() {
  return (
    <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-12 sm:p-16 border border-blue-200">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
          Gata să îți{" "}
          <span className="text-primary">digitalizezi agenția</span>?
        </h2>
        <p className="mt-4 text-lg text-muted max-w-xl mx-auto">
          Începe cu 14 zile trial gratuit. Fără card de credit, fără angajament. Vezi singur ce poate Imobify pentru tine.
        </p>

        <div className="mt-8 flex justify-center">
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <button className="px-8 py-4 rounded-xl text-base font-semibold bg-primary text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
              Începe acum gratuit
            </button>
          </SignUpButton>
        </div>

        <p className="mt-4 text-xs text-muted">
          14 zile trial gratuit. Fără card de credit.
        </p>
      </div>
    </section>
  );
}
