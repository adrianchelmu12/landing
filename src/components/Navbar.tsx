"use client";

import { useState } from "react";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";

const links = [
  { label: "Funcționalități", href: "#features" },
  { label: "Prețuri", href: "#pricing" },
  { label: "Contact", href: "#cta" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2 font-bold text-xl text-foreground">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="14" width="8" height="16" rx="2" fill="var(--primary)" />
              <rect x="12" y="8" width="8" height="22" rx="2" fill="var(--primary)" opacity="0.8" />
              <rect x="22" y="2" width="8" height="28" rx="2" fill="var(--primary)" opacity="0.6" />
            </svg>
            Imobify
          </a>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            ))}
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <button className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors">
                    Autentificare
                  </button>
                </SignInButton>
                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                  <button className="px-4 py-2 rounded-lg text-sm font-semibold border border-primary text-primary hover:bg-primary/10 transition-colors">
                    Înregistrare
                  </button>
                </SignUpButton>
              </>
            ) : (
              <a
                href="/dashboard"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                Dashboard
              </a>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-card transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Meniu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-muted hover:text-foreground transition-colors py-2"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <button className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors text-center w-full">
                    Autentificare
                  </button>
                </SignInButton>
                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                  <button className="px-4 py-2 rounded-lg text-sm font-semibold border border-primary text-primary hover:bg-primary/10 transition-colors text-center w-full">
                    Înregistrare
                  </button>
                </SignUpButton>
              </>
            ) : (
              <a
                href="/dashboard"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors text-center"
              >
                Dashboard
              </a>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
