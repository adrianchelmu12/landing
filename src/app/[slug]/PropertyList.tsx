"use client";

import { useState, useMemo } from "react";
import PropertyCard from "@/components/PropertyCard";
import FilterBar, { FilterValues } from "@/components/FilterBar";

interface Proprietate {
  id: number;
  titlu: string;
  tip: string | null;
  tip_tranzactie: string | null;
  pret: string | null;
  pret_numeric: number | null;
  descriere: string | null;
  imagine: string | null;
  fotografii: any;
  adresa: any;
  caracteristici: any;
  negociabil: boolean | null;
  badge_exclusivitate: boolean | null;
  badge_comision_zero: boolean | null;
  status_proprietate: string | null;
  created_at: string | null;
}

interface PropertyListProps {
  slug: string;
  allProperties: Proprietate[];
  orgName: string;
  primaryColor: string;
  secondaryColor: string;
}

export default function PropertyList({ slug, allProperties, orgName, primaryColor, secondaryColor }: PropertyListProps) {
  const [filters, setFilters] = useState<FilterValues>({
    tranzactie: "",
    tip: "",
    camere: "",
    pretMin: "",
    pretMax: "",
    sort: "created_at_desc",
  });

  const filtered = useMemo(() => {
    let result = [...allProperties];

    if (filters.tranzactie) {
      result = result.filter((p) => p.tip_tranzactie === filters.tranzactie);
    }

    if (filters.tip) {
      result = result.filter((p) => p.tip === filters.tip);
    }

    if (filters.camere) {
      const n = parseInt(filters.camere);
      result = result.filter((p) => {
        const c = typeof p.caracteristici === "object" && p.caracteristici !== null
          ? parseInt(p.caracteristici.nr_camere) || 0
          : 0;
        if (n >= 4) return c >= 4;
        return c === n;
      });
    }

    if (filters.pretMin) {
      const min = parseFloat(filters.pretMin);
      if (!isNaN(min)) {
        result = result.filter((p) => {
          if (p.pret_numeric) return p.pret_numeric >= min;
          const num = parseFloat((p.pret || "").replace(/[^\d]/g, ""));
          return !isNaN(num) && num >= min;
        });
      }
    }

    if (filters.pretMax) {
      const max = parseFloat(filters.pretMax);
      if (!isNaN(max)) {
        result = result.filter((p) => {
          if (p.pret_numeric) return p.pret_numeric <= max;
          const num = parseFloat((p.pret || "").replace(/[^\d]/g, ""));
          return !isNaN(num) && num <= max;
        });
      }
    }

    switch (filters.sort) {
      case "pret_numeric_asc":
        result.sort((a, b) => (a.pret_numeric || 0) - (b.pret_numeric || 0));
        break;
      case "pret_numeric_desc":
        result.sort((a, b) => (b.pret_numeric || 0) - (a.pret_numeric || 0));
        break;
      default:
        break;
    }

    return result;
  }, [allProperties, filters]);

  return (
    <>
      <div style={{
        background: `linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}08)`,
        borderBottom: "0.5px solid #e4e4e7",
        padding: "60px 24px 48px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: `0 8px 24px ${primaryColor}30`,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </div>
          <h1 style={{
            fontSize: "clamp(26px, 4vw, 38px)",
            fontWeight: 900,
            color: "#18181b",
            margin: "0 0 10px",
            letterSpacing: "-1px",
            lineHeight: 1.15,
          }}>
            {orgName}
          </h1>
          <p style={{ fontSize: 16, color: "#71717a", margin: "0 auto", maxWidth: 500 }}>
            {allProperties.length > 0
              ? `${allProperties.length} proprietăți disponibile — găsește locuința perfectă pentru tine.`
              : `Agenția ta imobiliară de încredere.`}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 60px" }}>

      <FilterBar
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        onFilter={setFilters}
        totalCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "#f4f4f5", display: "flex",
            alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <rect x="8" y="8" width="8" height="8" rx="1" />
            </svg>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#18181b", margin: "0 0 6px" }}>
            Nicio proprietate găsită
          </h2>
          <p style={{ color: "#71717a", fontSize: 13, margin: 0 }}>
            {allProperties.length === 0
              ? "Această agenție nu a publicat încă oferte."
              : "Încearcă să ajustezi filtrele de mai sus."}
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 22,
        }}>
          {filtered.map((p) => (
            <PropertyCard
              key={p.id}
              id={p.id}
              slug={slug}
              titlu={p.titlu}
              tip_tranzactie={p.tip_tranzactie}
              pret={p.pret}
              pret_numeric={p.pret_numeric}
              descriere={p.descriere}
              imagine={p.imagine}
              fotografii={p.fotografii}
              adresa={p.adresa}
              caracteristici={p.caracteristici}
              negociabil={p.negociabil}
              badge_exclusivitate={p.badge_exclusivitate}
              badge_comision_zero={p.badge_comision_zero}
              status_proprietate={p.status_proprietate}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
          ))}
        </div>
      )}
      </div>
    </>
  );
}
