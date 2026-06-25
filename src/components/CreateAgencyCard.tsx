"use client";

import { useState } from "react";
import { useOrganizationList } from "@clerk/nextjs";

export function CreateAgencyCard() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { createOrganization } = useOrganizationList();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Numele agenției este obligatoriu.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      if (!createOrganization) {
        throw new Error("Funcția de creare nu este disponibilă. Reîncearcă.");
      }
      const org = await createOrganization({ name: name.trim() });

      await fetch("/api/org", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId: org.id, name: name.trim(), agencyName: name.trim() }),
      });

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "A apărut o eroare.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-primary/20 p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-3">
        Creează-ți agenția
      </h2>
      <p className="text-muted mb-6 max-w-md mx-auto">
        Pentru a accesa CRM-ul și a începe să gestionezi proprietăți, clienți și tranzacții, creează mai întâi o agenție.
      </p>

      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        <div className="mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Numele agenției tale"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow text-center"
          />
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 disabled:opacity-50"
        >
          {loading ? "Se creează..." : "Creează agenția"}
        </button>
      </form>
    </div>
  );
}
