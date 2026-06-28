"use client";

import { useState } from "react";
import Link from "next/link";

interface PropertyCardProps {
  id: number;
  slug: string;
  titlu: string;
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
  primaryColor: string;
  secondaryColor: string;
}

function formatPrice(pret: string | null, pretNumeric: number | null): string {
  if (pret) return pret;
  if (pretNumeric) {
    return new Intl.NumberFormat("ro-RO", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(pretNumeric);
  }
  return "Preț la cerere";
}

function getAddress(adresa: any): string {
  if (typeof adresa === "string") return adresa;
  if (typeof adresa === "object" && adresa !== null) {
    return [adresa.cartier, adresa.localitate || adresa.oras].filter(Boolean).join(", ") || "";
  }
  return "";
}

function getFirstImage(imagine: string | null, fotografii: any): string | null {
  if (imagine) return imagine;
  if (Array.isArray(fotografii) && fotografii.length > 0) return fotografii[0];
  return null;
}

function getRooms(caracteristici: any): string {
  if (typeof caracteristici === "object" && caracteristici !== null) {
    const n = caracteristici.nr_camere;
    if (n) return `${n} cam.`;
  }
  return "";
}

function getArea(caracteristici: any): string {
  if (typeof caracteristici === "object" && caracteristici !== null) {
    const s = caracteristici.suprafata_utila || caracteristici.suprafata;
    if (s) return `${s} m²`;
  }
  return "";
}

const tipTranzactieColors: Record<string, string> = {
  vanzare: "#10b981",
  inchiriere: "#6366f1",
};

export default function PropertyCard(props: PropertyCardProps) {
  const {
    id, slug, titlu, tip_tranzactie, pret, pret_numeric,
    imagine, fotografii, adresa, caracteristici, descriere,
    negociabil, badge_exclusivitate, badge_comision_zero,
    status_proprietate, primaryColor, secondaryColor,
  } = props;

  const [isFav, setIsFav] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("imob-favorites") || "[]").includes(id);
    } catch { return false; }
  });

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const favs = JSON.parse(localStorage.getItem("imob-favorites") || "[]");
      const updated = favs.includes(id) ? favs.filter((f: number) => f !== id) : [...favs, id];
      localStorage.setItem("imob-favorites", JSON.stringify(updated));
      setIsFav(!isFav);
    } catch {}
  };

  const image = getFirstImage(imagine, fotografii);
  const address = getAddress(adresa);
  const rooms = getRooms(caracteristici);
  const area = getArea(caracteristici);
  const ttc = tipTranzactieColors[tip_tranzactie || ""] || primaryColor;
  const isSold = status_proprietate === "vandut" || status_proprietate === "inchiriat";
  const statusLabel = status_proprietate === "vandut" ? "Vândut" : status_proprietate === "inchiriat" ? "Închiriat" : "";
  const transactionLabel = tip_tranzactie === "inchiriere" ? "Închiriere" : tip_tranzactie === "vanzare" ? "Vânzare" : "";

  return (
    <Link
      href={`/${slug}/${id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        border: "0.5px solid #e4e4e7",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        transition: "transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
        display: "block",
        position: "relative",
        cursor: "pointer",
        opacity: isSold ? 0.7 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
      }}
    >
      <div style={{ position: "relative", height: 220, background: "#f4f4f5", overflow: "hidden" }}>
        {image ? (
          <img
            src={image}
            alt={titlu}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#a1a1aa" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}

        {transactionLabel && (
          <span style={{
            position: "absolute", top: 10, left: 10,
            background: ttc, color: "#fff",
            padding: "3px 10px", borderRadius: 999,
            fontSize: 11, fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.3px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}>
            {transactionLabel}
          </span>
        )}

        {badge_exclusivitate && (
          <span style={{
            position: "absolute", top: 10, right: 10,
            background: secondaryColor, color: "#fff",
            padding: "3px 8px", borderRadius: 6,
            fontSize: 10, fontWeight: 700,
            textTransform: "uppercase",
          }}>
            Exclusiv
          </span>
        )}

        {badge_comision_zero && (
          <span style={{
            position: "absolute", top: badge_exclusivitate ? 38 : 10, right: 10,
            background: "#10b981", color: "#fff",
            padding: "3px 8px", borderRadius: 6,
            fontSize: 10, fontWeight: 700,
            textTransform: "uppercase",
          }}>
            Comision 0
          </span>
        )}

        {negociabil && (
          <span style={{
            position: "absolute", bottom: 10, left: 10,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
            color: "#fff", padding: "3px 10px", borderRadius: 999,
            fontSize: 11, fontWeight: 600,
          }}>
            Negociabil
          </span>
        )}

        {isSold && statusLabel && (
          <div style={{
            position: "absolute", top: 16, right: -32,
            background: status_proprietate === "vandut" ? "#dc2626" : "#6366f1",
            color: "#fff", padding: "4px 40px",
            fontSize: 11, fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.5px",
            transform: "rotate(45deg)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 5,
          }}>
            {statusLabel}
          </div>
        )}

        <button
          onClick={toggleFav}
          style={{
            position: "absolute", bottom: 10, right: 10,
            width: 34, height: 34, borderRadius: "50%",
            border: "none", background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "transform 0.2s ease",
            zIndex: 2,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {isFav ? "❤️" : "🤍"}
        </button>
      </div>

      <div style={{ padding: "16px 18px" }}>
        <h3 style={{
          fontSize: 16, fontWeight: 800, color: "#111",
          margin: "0 0 4px", lineHeight: 1.3,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {titlu}
        </h3>

        {address && (
          <p style={{
            fontSize: 12.5, color: "#71717a", margin: "0 0 10px",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
              📍 {address}
            </span>
          </p>
        )}

        <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
          {(rooms || area) && (
            <>
              {rooms && <span style={{ padding: "3px 8px", borderRadius: 6, background: "#f4f4f5", fontSize: 11, fontWeight: 600, color: "#52525b" }}>{rooms}</span>}
              {area && <span style={{ padding: "3px 8px", borderRadius: 6, background: "#f4f4f5", fontSize: 11, fontWeight: 600, color: "#52525b" }}>{area}</span>}
            </>
          )}
          {!rooms && !area && descriere && (
            <span style={{ fontSize: 12, color: "#a1a1aa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
              {descriere.slice(0, 60)}{descriere.length > 60 ? "..." : ""}
            </span>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 19, fontWeight: 900, color: primaryColor, letterSpacing: "-0.5px" }}>
            {formatPrice(pret, pret_numeric)}
          </span>
          <span style={{
            fontSize: 12, fontWeight: 700, color: primaryColor,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            Vezi detalii →
          </span>
        </div>
      </div>
    </Link>
  );
}
