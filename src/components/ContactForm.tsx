"use client";

import { useState } from "react";

interface ContactFormProps {
  propertyTitle: string;
  orgName: string;
  orgPhone: string | null;
  orgEmail: string | null;
  primaryColor: string;
  secondaryColor: string;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 10,
  border: "0.5px solid #e4e4e7",
  background: "#fafafa",
  fontSize: 14,
  color: "#18181b",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

export default function ContactForm({ propertyTitle, orgName, orgPhone, orgEmail, primaryColor, secondaryColor }: ContactFormProps) {
  const [nume, setNume] = useState("");
  const [telefon, setTelefon] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [gdpr, setGdpr] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const canSubmit = nume.trim() && telefon.trim() && gdpr && !sending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSending(true);
    setError("");

    const text = `Cerere de contact pentru "${propertyTitle}"\nNume: ${nume}\nTelefon: ${telefon}\nMesaj: ${mesaj || "—"}\n\nTrimis prin landing page ${orgName}`;

    if (orgPhone) {
      const whatsappNumber = orgPhone.replace(/[\s\+\(\)-]/g, "");
      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, "_blank");
    }

    setSubmitted(true);
    setSending(false);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#18181b", margin: "0 0 6px" }}>Mesaj trimis!</h3>
        <p style={{ fontSize: 13, color: "#71717a", margin: 0 }}>
          Te vom contacta în cel mai scurt timp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#52525b", marginBottom: 4 }}>
          Nume complet *
        </label>
        <input
          type="text"
          value={nume}
          onChange={(e) => setNume(e.target.value)}
          placeholder="Numele tău"
          style={inputStyle}
          required
          onFocus={(e) => { e.currentTarget.style.borderColor = primaryColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${primaryColor}15`; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#e4e4e7"; e.currentTarget.style.boxShadow = "none"; }}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#52525b", marginBottom: 4 }}>
          Telefon *
        </label>
        <input
          type="tel"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
          placeholder="07xx xxx xxx"
          style={inputStyle}
          required
          onFocus={(e) => { e.currentTarget.style.borderColor = primaryColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${primaryColor}15`; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#e4e4e7"; e.currentTarget.style.boxShadow = "none"; }}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#52525b", marginBottom: 4 }}>
          Mesaj (opțional)
        </label>
        <textarea
          value={mesaj}
          onChange={(e) => setMesaj(e.target.value)}
          placeholder="Aș dori o vizionare pentru această proprietate..."
          rows={3}
          style={{ ...inputStyle, resize: "vertical", minHeight: 80, fontFamily: "inherit" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = primaryColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${primaryColor}15`; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#e4e4e7"; e.currentTarget.style.boxShadow = "none"; }}
        />
      </div>

      <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={gdpr}
          onChange={(e) => setGdpr(e.target.checked)}
          style={{ marginTop: 3, accentColor: primaryColor, width: 16, height: 16 }}
        />
        <span style={{ fontSize: 12, color: "#71717a", lineHeight: 1.4 }}>
          Sunt de acord cu prelucrarea datelor personale în scopul contactării de către {orgName}.
        </span>
      </label>

      {error && (
        <p style={{ color: "#dc2626", fontSize: 12, margin: 0 }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        style={{
          width: "100%",
          padding: "14px 0",
          borderRadius: 10,
          border: "none",
          background: canSubmit ? primaryColor : "#d4d4d8",
          color: "#fff",
          fontSize: 14,
          fontWeight: 700,
          cursor: canSubmit ? "pointer" : "not-allowed",
          transition: "all 0.2s ease",
          boxShadow: canSubmit ? "0 4px 16px rgba(0,0,0,0.15)" : "none",
        }}
        onMouseEnter={(e) => { if (canSubmit) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; } }}
        onMouseLeave={(e) => { if (canSubmit) { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)"; } }}
      >
        {sending ? "Se trimite..." : "Programează o vizionare"}
      </button>

      {orgPhone && (
        <a
          href={`tel:${orgPhone}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "14px 0",
            borderRadius: 10,
            border: `2px solid ${primaryColor}`,
            background: "transparent",
            color: primaryColor,
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = `${primaryColor}08`; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          {orgPhone}
        </a>
      )}
    </form>
  );
}
