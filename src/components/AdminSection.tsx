"use client";

import { useUser } from "@clerk/nextjs";

export function AdminSection() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) return null;

  const isSuperAdmin = user.id === process.env.NEXT_PUBLIC_SUPER_ADMIN_USER_ID;

  if (!isSuperAdmin) return null;

  return (
    <div className="bg-white rounded-2xl border border-purple-200 p-8">
      <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
        Administrare platformă
      </h2>
      <p className="text-muted mb-4">
        Ai acces de super-admin. Gestionează toate agențiile și utilizatorii.
      </p>
      <a
        href="/dashboard/admin"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors"
      >
        Vezi toate agențiile
      </a>
    </div>
  );
}
