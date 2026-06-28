"use client";

import { useState } from "react";

interface FilterBarProps {
  primaryColor: string;
  secondaryColor: string;
  onFilter: (filters: FilterValues) => void;
  totalCount: number;
}

export interface FilterValues {
  tranzactie: string;
  tip: string;
  camere: string;
  pretMin: string;
  pretMax: string;
  sort: string;
}

const TIP_OPTIONS = [
  { value: "", label: "Toate tipurile" },
  { value: "Apartament", label: "Apartament" },
  { value: "Garsonieră", label: "Garsonieră" },
  { value: "Casă", label: "Casă" },
  { value: "Terenuri", label: "Terenuri" },
  { value: "Spațiu comercial", label: "Spațiu comercial" },
  { value: "Birouri", label: "Birouri" },
];

const CAMERE_OPTIONS = [
  { value: "", label: "Orice" },
  { value: "1", label: "1 cameră" },
  { value: "2", label: "2 camere" },
  { value: "3", label: "3 camere" },
  { value: "4", label: "4+ camere" },
];

const SORT_OPTIONS = [
  { value: "created_at_desc", label: "Cele mai noi" },
  { value: "pret_numeric_asc", label: "Preț crescător" },
  { value: "pret_numeric_desc", label: "Preț descrescător" },
];

const selectStyle = (primaryColor: string): React.CSSProperties => ({
  padding: "10px 14px",
  borderRadius: 10,
  border: "0.5px solid #e4e4e7",
  background: "white",
  fontSize: 13,
  fontWeight: 500,
  color: "#18181b",
  outline: "none",
  cursor: "pointer",
  minWidth: 130,
  transition: "border-color 0.2s, box-shadow 0.2s",
  WebkitAppearance: "none" as any,
  appearance: "none" as any,
});

const inputStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "0.5px solid #e4e4e7",
  background: "white",
  fontSize: 13,
  fontWeight: 500,
  color: "#18181b",
  outline: "none",
  width: 110,
  transition: "border-color 0.2s, box-shadow 0.2s",
};

export default function FilterBar({ primaryColor, secondaryColor, onFilter, totalCount }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterValues>({
    tranzactie: "",
    tip: "",
    camere: "",
    pretMin: "",
    pretMax: "",
    sort: "created_at_desc",
  });

  const update = (key: keyof FilterValues, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilter(next);
  };

  const reset = () => {
    const empty: FilterValues = { tranzactie: "", tip: "", camere: "", pretMin: "", pretMax: "", sort: "created_at_desc" };
    setFilters(empty);
    onFilter(empty);
  };

  const hasFilters = filters.tranzactie || filters.tip || filters.camere || filters.pretMin || filters.pretMax;

  return (
    <div style={{
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "0.5px solid rgba(0,0,0,0.06)",
      borderRadius: 20,
      padding: "18px 20px",
      marginBottom: 28,
      boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
    }}>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: 0, borderRadius: 10, overflow: "hidden", border: "0.5px solid #e4e4e7" }}>
          <button
            onClick={() => update("tranzactie", filters.tranzactie === "vanzare" ? "" : "vanzare")}
            style={{
              padding: "10px 18px",
              border: "none",
              background: filters.tranzactie === "vanzare" ? primaryColor : "white",
              color: filters.tranzactie === "vanzare" ? "#fff" : "#18181b",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Vânzare
          </button>
          <button
            onClick={() => update("tranzactie", filters.tranzactie === "inchiriere" ? "" : "inchiriere")}
            style={{
              padding: "10px 18px",
              border: "none",
              borderLeft: "0.5px solid #e4e4e7",
              background: filters.tranzactie === "inchiriere" ? primaryColor : "white",
              color: filters.tranzactie === "inchiriere" ? "#fff" : "#18181b",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Închiriere
          </button>
        </div>

        <select
          value={filters.tip}
          onChange={(e) => update("tip", e.target.value)}
          style={selectStyle(primaryColor)}
          onFocus={(e) => { e.currentTarget.style.borderColor = primaryColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${primaryColor}15`; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#e4e4e7"; e.currentTarget.style.boxShadow = "none"; }}
        >
          {TIP_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select
          value={filters.camere}
          onChange={(e) => update("camere", e.target.value)}
          style={selectStyle(primaryColor)}
          onFocus={(e) => { e.currentTarget.style.borderColor = primaryColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${primaryColor}15`; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#e4e4e7"; e.currentTarget.style.boxShadow = "none"; }}
        >
          {CAMERE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <input
          type="number"
          placeholder="Preț min"
          value={filters.pretMin}
          onChange={(e) => update("pretMin", e.target.value)}
          style={inputStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = primaryColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${primaryColor}15`; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#e4e4e7"; e.currentTarget.style.boxShadow = "none"; }}
        />

        <input
          type="number"
          placeholder="Preț max"
          value={filters.pretMax}
          onChange={(e) => update("pretMax", e.target.value)}
          style={inputStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = primaryColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${primaryColor}15`; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#e4e4e7"; e.currentTarget.style.boxShadow = "none"; }}
        />

        <select
          value={filters.sort}
          onChange={(e) => update("sort", e.target.value)}
          style={selectStyle(primaryColor)}
          onFocus={(e) => { e.currentTarget.style.borderColor = primaryColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${primaryColor}15`; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#e4e4e7"; e.currentTarget.style.boxShadow = "none"; }}
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {hasFilters && (
          <button
            onClick={reset}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "none",
              background: "transparent",
              color: "#71717a",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Resetează
          </button>
        )}
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: "#a1a1aa", fontWeight: 500 }}>
        {totalCount} proprietăți găsite
      </div>
    </div>
  );
}
