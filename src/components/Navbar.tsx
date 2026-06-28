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
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl">
      <div
        className={`bg-white/80 backdrop-blur-xl border border-border/40 shadow-lg shadow-black/5 transition-all duration-300 ${
          open ? "rounded-3xl" : "rounded-full"
        }`}
      >
        <div className="flex items-center justify-between h-14 px-6">
          <a href="#" className="flex items-center gap-2 font-bold text-lg text-foreground shrink-0">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <button className="px-4 py-2 rounded-full text-sm font-medium text-muted hover:text-foreground transition-colors">
                    Autentificare
                  </button>
                </SignInButton>
                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                  <button className="px-5 py-2 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors shadow-sm">
                    Înregistrare
                  </button>
                </SignUpButton>
              </>
            ) : (
              <a
                href="/dashboard"
                className="px-5 py-2 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors shadow-sm"
              >
                Dashboard
              </a>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Meniu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden px-6 pb-5 pt-1 flex flex-col gap-2 border-t border-border/40 mt-1">
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
            <div className="flex gap-2 pt-2">
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                    <button className="flex-1 px-4 py-2 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-gray-50 transition-colors text-center">
                      Autentificare
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                    <button className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors text-center">
                      Înregistrare
                    </button>
                  </SignUpButton>
                </>
              ) : (
                <a
                  href="/dashboard"
                  className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors text-center"
                >
                  Dashboard
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
