"use client";

import { useUser, useOrganizationList } from "@clerk/nextjs";
import { AdminSection } from "@/components/AdminSection";
import { CreateAgencyCard } from "@/components/CreateAgencyCard";
import { TeamSection } from "@/components/TeamSection";

export default function DashboardPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: listLoaded, userMemberships } = useOrganizationList({
    userMemberships: true,
  });

  if (!userLoaded || !listLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isSuperAdmin = user?.id === process.env.NEXT_PUBLIC_SUPER_ADMIN_USER_ID;
  const hasOrganization = (userMemberships?.data?.length ?? 0) > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted">Gestionează contul tău și accesează aplicația CRM.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {isSuperAdmin ? (
            <AdminSection />
          ) : (hasOrganization ? (
            <>
              <div className="bg-white rounded-2xl border border-border p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Platforma CRM
                </h2>
                <p className="text-muted mb-6">
                  Accesează dashboard-ul complet pentru gestionarea proprietăților, clienților, pipeline-ului de vânzări și mult mai mult.
                </p>
                <a
                  href="https://imob-psi.vercel.app/admin"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                  Intră în CRM
                </a>
              </div>

              <TeamSection />

              <div className="bg-white rounded-2xl border border-border p-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Abonament
                </h2>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-800">Abonamentul va fi disponibil în curând</p>
                    <p className="text-xs text-amber-600 mt-0.5">Integrarea cu Stripe este în lucru.</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <CreateAgencyCard />
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Cont</h3>
            <ul className="space-y-3">
              <li>
                <a href="/dashboard/settings" className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  Setări agenție
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
