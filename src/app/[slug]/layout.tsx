import { neon } from "@neondatabase/serverless";
import type { Metadata } from "next";
import Link from "next/link";

async function getOrg(slug: string) {
  try {
    const db = neon(process.env.DATABASE_URL!);
    const rows = await db`SELECT * FROM organizations WHERE slug = ${slug} AND landing_enabled = true LIMIT 1`;
    return rows[0] || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const org = await getOrg(slug);
  if (!org) return { title: "Pagina nu a fost găsită" };
  return {
    title: `${org.name} - Proprietăți Imobiliare`,
    description: `Proprietăți imobiliare disponibile prin ${org.name}. Vezi oferta completă de apartamente, case și terenuri.`,
    openGraph: {
      title: `${org.name} - Proprietăți Imobiliare`,
      description: `Proprietăți imobiliare disponibile prin ${org.name}.`,
      locale: "ro_RO",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${org.name} - Proprietăți Imobiliare`,
      description: `Proprietăți imobiliare disponibile prin ${org.name}.`,
    },
  };
}

export default async function AgencyLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const org = await getOrg(slug);

  if (!org) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f5", fontFamily: "Inter, system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#18181b", margin: "0 0 8px" }}>Agenția nu a fost găsită</h1>
          <p style={{ color: "#71717a", fontSize: 14, marginBottom: 20 }}>Verifică adresa sau contactează-ne.</p>
          <a href="https://imobify.ro" style={{ color: "#dc2626", fontWeight: 700, fontSize: 14 }}>Înapoi la Imobify</a>
        </div>
      </div>
    );
  }

  const primaryColor = org.landing_primary_color || "#dc2626";
  const secondaryColor = org.landing_secondary_color || "#18181b";
  const orgName = org.name || "Agenție";
  const logoUrl = org.logo_url || null;
  const phone = org.phone || "";
  const email = org.email || "";
  const address = [org.address, org.city, org.county].filter(Boolean).join(", ") || "";

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#f4f4f5", color: "#18181b", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <header style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "0.5px solid rgba(0,0,0,0.06)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}>
            <div style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 64,
            }}>
              <Link href={`/${slug}`} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                {logoUrl ? (
                  <img src={logoUrl} alt={orgName} style={{ height: 34, width: "auto", maxWidth: 140, objectFit: "contain" }} />
                ) : (
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 800, fontSize: 17,
                    boxShadow: `0 4px 12px ${primaryColor}30`,
                  }}>
                    {orgName.charAt(0)}
                  </div>
                )}
                <span style={{ fontSize: 17, fontWeight: 800, color: "#18181b", letterSpacing: "-0.3px" }}>{orgName}</span>
              </Link>

              <nav style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <Link href={`/${slug}`} style={{
                  fontSize: 13.5, fontWeight: 600, color: "#52525b", textDecoration: "none",
                  padding: "8px 14px", borderRadius: 8, transition: "all 0.2s",
                }}>
                  Proprietăți
                </Link>
                <Link href={`/${slug}/despre`} style={{
                  fontSize: 13.5, fontWeight: 600, color: "#52525b", textDecoration: "none",
                  padding: "8px 14px", borderRadius: 8, transition: "all 0.2s",
                }}>
                  Despre
                </Link>
                {phone && (
                  <a href={`tel:${phone}`} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: primaryColor, color: "#fff",
                    padding: "10px 18px", borderRadius: 10,
                    fontSize: 13.5, fontWeight: 700, textDecoration: "none",
                    transition: "all 0.2s ease",
                    boxShadow: `0 2px 12px ${primaryColor}30`,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {phone}
                  </a>
                )}
              </nav>
            </div>
          </header>

          <main style={{ flex: 1 }}>{children}</main>

          <footer style={{ background: "#18181b", color: "rgba(255,255,255,0.6)", marginTop: "auto" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 40,
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    {logoUrl ? (
                      <img src={logoUrl} alt={orgName} style={{ height: 28, width: "auto", filter: "brightness(10)" }} />
                    ) : (
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: 800, fontSize: 14,
                      }}>
                        {orgName.charAt(0)}
                      </div>
                    )}
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{orgName}</span>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.6, margin: "0 0 16px" }}>
                    Agenție imobiliară — găsește locuința perfectă prin platforma noastră.
                  </p>
                  {email && (
                    <a href={`mailto:${email}`} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none", display: "block", marginTop: 4 }}>
                      {email}
                    </a>
                  )}
                </div>

                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Servicii
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {["Vânzări", "Închirieri", "Consulting", "Evaluări"].map((s) => (
                      <Link key={s} href={`/${slug}`} style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.2s" }}>
                        {s}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Contact
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
                    {phone && <span>{phone}</span>}
                    {address && <span>{address}</span>}
                  </div>
                </div>
              </div>

              <div style={{
                borderTop: "0.5px solid rgba(255,255,255,0.08)",
                marginTop: 32,
                paddingTop: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                  {org.company_name && <>{org.company_name} — </>}CUI: {org.cui || "—"}  |  © {new Date().getFullYear()}. Toate drepturile rezervate.
                </span>
                <span style={{ fontSize: 12 }}>
                  Powered by{" "}
                  <a href="https://imobify.ro" style={{ color: primaryColor, fontWeight: 700, textDecoration: "none" }}>Imobify</a>
                </span>
              </div>
            </div>
          </footer>
        </div>
  );
}
