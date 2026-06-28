"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Lightbox from "@/components/Lightbox";
import ContactForm from "@/components/ContactForm";

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
    return [adresa.strada, adresa.cartier, adresa.localitate || adresa.oras, adresa.judet].filter(Boolean).join(", ") || "";
  }
  return "";
}

function getImages(imagine: string | null, fotografii: any): string[] {
  const images: string[] = [];
  if (imagine) images.push(imagine);
  if (Array.isArray(fotografii)) {
    fotografii.forEach((f: any) => {
      if (typeof f === "string" && f && !images.includes(f)) images.push(f);
    });
  }
  return images;
}

function getCaracteristici(caracteristici: any): Record<string, string> {
  if (typeof caracteristici !== "object" || caracteristici === null) return {};
  const map: Record<string, string> = {};
  const labels: Record<string, string> = {
    nr_camere: "Camere", nr_bai: "Băi", etaj: "Etaj", nr_etaje_total: "Etaje total",
    suprafata_utila: "S. utilă", suprafata_totala: "S. totală", suprafata: "Suprafață",
    an_constructie: "An construcție", compartimentare: "Compartimentare",
    risc_seismic: "Risc seismic", acoperis: "Acoperiș", tip_imobil: "Tip imobil",
    deschidere_strada: "Deschidere", tip_teren: "Tip teren",
    nr_fronturi_stradale: "Fronturi", tip_casa: "Tip casă",
    suprafata_teren: "S. teren",
  };
  for (const [key, value] of Object.entries(caracteristici)) {
    if (value != null && String(value).trim() !== "" && String(value) !== "0" && String(value) !== "undefined") {
      const label = labels[key] || key;
      const display = key === "suprafata_utila" || key === "suprafata_totala" || key === "suprafata" || key === "suprafata_teren"
        ? `${value} m²`
        : String(value);
      map[label] = display;
    }
  }
  return map;
}

const textStyle: React.CSSProperties = { fontSize: 14, color: "#52525b", lineHeight: 1.75 };

export default function PropertyDetailClient({ slug, property, org, agent }: any) {
  const primaryColor = org.landing_primary_color || "#dc2626";
  const secondaryColor = org.landing_secondary_color || "#18181b";
  const orgName = org.name || "Agenție";
  const orgPhone = org.phone || agent?.telefon || "";
  const orgEmail = org.email || agent?.email || "";

  const images = useMemo(() => getImages(property.imagine, property.fotografii), [property]);
  const caracteristici = useMemo(() => getCaracteristici(property.caracteristici), [property]);
  const address = useMemo(() => getAddress(property.adresa), [property]);

  let dotari: string[] = [];
  if (Array.isArray(property.dotari)) dotari = property.dotari;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const isSold = property.status_proprietate === "vandut" || property.status_proprietate === "inchiriat";
  const statusLabel = property.status_proprietate === "vandut" ? "VÂNDUT" : property.status_proprietate === "inchiriat" ? "ÎNCHIRIAT" : "";

  const mapQuery = encodeURIComponent(address || "Iași");

  return (
    <>
      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setLightboxIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
          onNext={() => setLightboxIndex((i) => (i < images.length - 1 ? i + 1 : 0))}
        />
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 60px" }}>
        <Link
          href={`/${slug}`}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, color: primaryColor, fontWeight: 700,
            textDecoration: "none", marginBottom: 20,
          }}
        >
          ← Înapoi la toate proprietățile
        </Link>

        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 380px",
          gap: 32,
          alignItems: "start",
        }}>
          <div>
            {images.length > 0 ? (
              <div style={{ position: "relative", marginBottom: 32 }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: images.length === 1 ? "1fr" : "2fr 1fr",
                  gap: 6,
                  borderRadius: 18,
                  overflow: "hidden",
                  maxHeight: 480,
                }}>
                  <div
                    style={{ background: "#f4f4f5", cursor: "pointer", overflow: "hidden" }}
                    onClick={() => openLightbox(0)}
                  >
                    <img
                      src={images[0]}
                      alt={property.titlu}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                    />
                  </div>
                  {images.length > 1 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {images.slice(1, 3).map((img, idx) => (
                        <div
                          key={idx}
                          style={{ background: "#f4f4f5", flex: 1, cursor: "pointer", overflow: "hidden", position: "relative" }}
                          onClick={() => openLightbox(idx + 1)}
                        >
                          <img
                            src={img}
                            alt={`${property.titlu} - ${idx + 2}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                          />
                          {idx === 1 && images.length > 3 && (
                            <div
                              style={{
                                position: "absolute", inset: 0,
                                background: "rgba(0,0,0,0.45)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#fff", fontSize: 18, fontWeight: 800,
                              }}
                              onClick={() => openLightbox(3)}
                            >
                              +{images.length - 3} poze
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {isSold && statusLabel && (
                  <div style={{
                    position: "absolute", top: 20, right: -32,
                    background: property.status_proprietate === "vandut" ? "#dc2626" : "#6366f1",
                    color: "#fff", padding: "5px 44px",
                    fontSize: 12, fontWeight: 900,
                    textTransform: "uppercase", letterSpacing: "1px",
                    transform: "rotate(45deg)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                    zIndex: 5,
                  }}>
                    {statusLabel}
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                height: 320, borderRadius: 18, background: "#f4f4f5",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 32, color: "#a1a1aa",
              }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            )}

            <div style={{ marginBottom: 10 }}>
              {property.tip_tranzactie && (
                <span style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: 999,
                  background: property.tip_tranzactie === "vanzare" ? "#dcfce7" : "#eef2ff",
                  color: property.tip_tranzactie === "vanzare" ? "#16a34a" : "#6366f1",
                  fontSize: 12, fontWeight: 800,
                  textTransform: "uppercase", letterSpacing: "0.3px",
                  marginBottom: 10,
                }}>
                  {property.tip_tranzactie === "inchiriere" ? "Închiriere" : "Vânzare"}
                </span>
              )}
              <h1 style={{
                fontSize: "clamp(22px, 3vw, 30px)",
                fontWeight: 900,
                color: "#18181b",
                margin: "0 0 4px",
                letterSpacing: "-0.8px",
                lineHeight: 1.15,
              }}>
                {property.titlu}
              </h1>
              {address && (
                <p style={{ fontSize: 14, color: "#71717a", margin: "4px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                  📍 {address}
                </p>
              )}
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: 16,
              marginBottom: 24, flexWrap: "wrap",
            }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: primaryColor, letterSpacing: "-0.5px" }}>
                {formatPrice(property.pret, property.pret_numeric)}
              </span>
              {property.negociabil && (
                <span style={{
                  padding: "4px 12px", borderRadius: 999,
                  background: "#fef3c7", color: "#92400e",
                  fontSize: 12, fontWeight: 700,
                }}>
                  Preț negociabil
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
              {property.badge_exclusivitate && (
                <span style={{ padding: "4px 12px", borderRadius: 6, background: secondaryColor, color: "#fff", fontSize: 11, fontWeight: 700 }}>
                  ⭐ Exclusiv
                </span>
              )}
              {property.badge_comision_zero && (
                <span style={{ padding: "4px 12px", borderRadius: 6, background: "#dcfce7", color: "#16a34a", fontSize: 11, fontWeight: 700 }}>
                  💰 Comision 0
                </span>
              )}
            </div>

            {Object.keys(caracteristici).length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#18181b", margin: "0 0 14px" }}>
                  Caracteristici
                </h2>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))",
                  gap: 10,
                }}>
                  {Object.entries(caracteristici).map(([label, value]) => (
                    <div key={label} style={{
                      padding: "14px 16px",
                      borderRadius: 12,
                      background: "#fff",
                      border: "0.5px solid #e4e4e7",
                    }}>
                      <div style={{ fontSize: 11, color: "#a1a1aa", fontWeight: 500, marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#18181b" }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.descriere && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#18181b", margin: "0 0 12px" }}>Descriere</h2>
                <p style={textStyle}>{property.descriere}</p>
              </div>
            )}

            {dotari.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#18181b", margin: "0 0 12px" }}>Dotări</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {dotari.map((d, idx) => (
                    <span key={idx} style={{
                      padding: "6px 14px", borderRadius: 999,
                      background: `${primaryColor}10`, color: primaryColor,
                      fontSize: 12.5, fontWeight: 600,
                      border: `0.5px solid ${primaryColor}20`,
                    }}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#18181b", margin: "0 0 12px" }}>Locație</h2>
              <div style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "0.5px solid #e4e4e7",
                height: 320,
                background: "#f4f4f5",
              }}>
                <iframe
                  title="Hartă proprietate"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
            </div>

          </div>

          <div style={{ position: "sticky", top: 84 }}>
            {agent && (
              <div style={{
                padding: 22, borderRadius: 16,
                background: "#fff", border: "0.5px solid #e4e4e7",
                display: "flex", gap: 16, alignItems: "center",
                marginBottom: 20,
              }}>
                {agent.poza ? (
                  <img src={agent.poza} alt={agent.nume} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 800, fontSize: 22, flexShrink: 0,
                  }}>
                    {agent.nume?.charAt(0) || "A"}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#18181b" }}>{agent.nume}</div>
                  <div style={{ fontSize: 12, color: "#a1a1aa", marginTop: 2 }}>
                    {agent.rol === "admin" ? "Administrator" : agent.rol === "manager" ? "Manager" : "Agent imobiliar"}
                  </div>
                  {agent.telefon && (
                    <a href={`tel:${agent.telefon}`} style={{ fontSize: 13, color: primaryColor, fontWeight: 600, textDecoration: "none", marginTop: 4, display: "inline-block" }}>
                      {agent.telefon}
                    </a>
                  )}
                </div>
              </div>
            )}

            <div style={{
              padding: 24, borderRadius: 18,
              background: "#fff", border: "0.5px solid #e4e4e7",
              boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
            }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#18181b", margin: "0 0 4px" }}>
                Interesat?
              </h3>
              <p style={{ fontSize: 13, color: "#71717a", margin: "0 0 18px" }}>
                Completează formularul și te contactăm pentru o vizionare.
              </p>
              <ContactForm
                propertyTitle={property.titlu}
                orgName={orgName}
                orgPhone={orgPhone}
                orgEmail={orgEmail}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
