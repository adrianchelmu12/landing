import { neon } from "@neondatabase/serverless";
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

async function getAgents(orgId: string) {
  try {
    const db = neon(process.env.DATABASE_URL!);
    return await db`SELECT * FROM agenti WHERE org_id = ${orgId} ORDER BY rol, nume`;
  } catch {
    return [];
  }
}

async function getStats(orgId: string) {
  try {
    const db = neon(process.env.DATABASE_URL!);
    const [total] = await db`SELECT COUNT(*)::int as c FROM proprietati WHERE org_id = ${orgId} AND status = 'activ'`;
    const [disp] = await db`SELECT COUNT(*)::int as c FROM proprietati WHERE org_id = ${orgId} AND status = 'activ' AND status_proprietate = 'disponibil'`;
    return { total: total?.c || 0, disponibile: disp?.c || 0 };
  } catch {
    return { total: 0, disponibile: 0 };
  }
}

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  manager: "Manager",
  agent: "Agent imobiliar",
};

export default async function DesprePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const org = await getOrg(slug);

  if (!org) {
    return (
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#18181b" }}>Pagina nu a fost găsită</h1>
      </div>
    );
  }

  const agents = await getAgents(org.clerk_id);
  const stats = await getStats(org.clerk_id);
  const primaryColor = org.landing_primary_color || "#dc2626";
  const orgName = org.name || "Agenție";
  const phone = org.phone || agents[0]?.telefon || "";
  const email = org.email || agents[0]?.email || "";
  const address = [org.address, org.city, org.county].filter(Boolean).join(", ") || "";
  const logoUrl = org.logo_url || null;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 60px" }}>
      <Link
        href={`/${slug}`}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 13, color: primaryColor, fontWeight: 700,
          textDecoration: "none", marginBottom: 32,
        }}
      >
        ← Înapoi la proprietăți
      </Link>

      <div style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          {logoUrl ? (
            <img src={logoUrl} alt={orgName} style={{ width: 64, height: 64, borderRadius: 16, objectFit: "contain", background: "#fff", border: "1px solid #e4e4e7" }} />
          ) : (
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: `linear-gradient(135deg, ${primaryColor}, ${org.landing_secondary_color || "#18181b"})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 900, fontSize: 28,
            }}>
              {orgName.charAt(0)}
            </div>
          )}
          <div>
            <h1 style={{
              fontSize: "clamp(24px, 3vw, 32px)",
              fontWeight: 900, color: "#18181b",
              margin: "0 0 4px", letterSpacing: "-0.8px",
            }}>
              Despre {orgName}
            </h1>
            <p style={{ fontSize: 14, color: "#71717a", margin: 0 }}>
              Agenție imobiliară
            </p>
          </div>
        </div>
      </div>

      {org.landing_about_text && (
        <div style={{
          background: "#fff", borderRadius: 16, border: "0.5px solid #e4e4e7",
          padding: 28, marginBottom: 40,
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#18181b", margin: "0 0 12px" }}>
            Cine suntem
          </h2>
          <p style={{ fontSize: 14, color: "#52525b", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
            {org.landing_about_text}
          </p>
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 16,
        marginBottom: 48,
      }}>
        {[
          { label: "Proprietăți", value: stats.total },
          { label: "Disponibile", value: stats.disponibile },
          { label: "Agenți", value: agents.length },
          { label: "Ani experiență", value: org.landing_experience_years || "+10" },
        ].map((s) => (
          <div key={s.label} style={{
            padding: "20px 16px", borderRadius: 14,
            background: "#fff", border: "0.5px solid #e4e4e7",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: primaryColor }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#a1a1aa", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {agents.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#18181b", margin: "0 0 20px" }}>
            Echipa noastră
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}>
            {agents.map((agent: any) => (
              <div key={agent.id} style={{
                padding: 22, borderRadius: 16,
                background: "#fff", border: "0.5px solid #e4e4e7",
                display: "flex", gap: 16, alignItems: "center",
              }}>
                {agent.poza ? (
                  <img src={agent.poza} alt={agent.nume} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${primaryColor}, ${org.landing_secondary_color || "#18181b"})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 800, fontSize: 22, flexShrink: 0,
                  }}>
                    {agent.nume?.charAt(0) || "A"}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#18181b" }}>{agent.nume}</div>
                  <div style={{ fontSize: 12, color: "#a1a1aa", marginTop: 2 }}>
                    {roleLabels[agent.rol] || "Agent"}
                  </div>
                  {agent.telefon && (
                    <a href={`tel:${agent.telefon}`} style={{ fontSize: 12.5, color: primaryColor, fontWeight: 600, textDecoration: "none", marginTop: 4, display: "inline-block" }}>
                      {agent.telefon}
                    </a>
                  )}
                  {agent.email && (
                    <div style={{ fontSize: 11, color: "#a1a1aa", marginTop: 2 }}>{agent.email}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 24,
      }}>
        <div style={{
          padding: 28, borderRadius: 16,
          background: "#fff", border: "0.5px solid #e4e4e7",
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#18181b", margin: "0 0 16px" }}>Contact</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14, color: "#52525b" }}>
            {phone && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>📞</span>
                <a href={`tel:${phone}`} style={{ color: primaryColor, fontWeight: 700, textDecoration: "none" }}>{phone}</a>
              </div>
            )}
            {email && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>✉️</span>
                <a href={`mailto:${email}`} style={{ color: primaryColor, textDecoration: "none" }}>{email}</a>
              </div>
            )}
            {address && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontSize: 18 }}>📍</span>
                <span>{address}</span>
              </div>
            )}
          </div>
        </div>

        {address && (
          <div style={{
            borderRadius: 16, overflow: "hidden",
            border: "0.5px solid #e4e4e7", minHeight: 250,
          }}>
            <iframe
              title="Locație agenție"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 250 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
