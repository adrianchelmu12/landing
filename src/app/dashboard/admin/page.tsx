"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Organization {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  membersCount: number;
  agencyName: string;
  agencyCity: string;
  agencyCounty: string;
  agencyPhone: string;
  agencyEmail: string;
  createdAt: number;
  error?: boolean;
}

export default function AdminPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/organizations")
      .then((res) => {
        if (!res.ok) throw new Error(`Eroare ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setOrgs(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Înapoi la dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Administrare agenții</h1>
        <p className="mt-1 text-muted">Lista completă a agențiilor înregistrate în platformă.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Agenție</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Locație</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Contact</th>
                  <th className="text-center px-6 py-4 font-semibold text-foreground">Membri</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Înregistrat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orgs.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {org.imageUrl ? (
                          <img src={org.imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-muted font-bold">
                            {(org.agencyName || org.name).charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-foreground">{org.agencyName || org.name}</div>
                          <div className="text-xs text-muted">{org.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {org.agencyCity || org.agencyCounty
                        ? `${org.agencyCity}${org.agencyCity && org.agencyCounty ? ", " : ""}${org.agencyCounty}`
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      {org.agencyEmail && (
                        <div className="text-muted text-xs">{org.agencyEmail}</div>
                      )}
                      {org.agencyPhone && (
                        <div className="text-muted text-xs">{org.agencyPhone}</div>
                      )}
                      {!org.agencyEmail && !org.agencyPhone && "—"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {org.membersCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted text-xs">
                      {new Date(org.createdAt).toLocaleDateString("ro-RO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orgs.length === 0 && (
            <div className="py-12 text-center text-muted">Nicio agenție înregistrată.</div>
          )}
        </div>
      )}
    </div>
  );
}
