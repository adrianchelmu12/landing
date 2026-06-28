import { neon } from "@neondatabase/serverless";
import PropertyList from "./PropertyList";

async function getOrg(slug: string) {
  try {
    const db = neon(process.env.DATABASE_URL!);
    const rows = await db`SELECT * FROM organizations WHERE slug = ${slug} AND landing_enabled = true LIMIT 1`;
    return rows[0] || null;
  } catch {
    return null;
  }
}

async function getProperties(orgId: string) {
  try {
    const db = neon(process.env.DATABASE_URL!);
    const rows = await db`SELECT * FROM proprietati WHERE org_id = ${orgId} AND status = 'activ' AND status_proprietate != 'vandut' AND status_proprietate != 'inchiriat' ORDER BY created_at DESC`;
    return rows;
  } catch {
    return [];
  }
}

export default async function AgencyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const org = await getOrg(slug);

  if (!org) {
    return (
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#18181b" }}>Pagina nu a fost găsită</h1>
      </div>
    );
  }

  const properties = await getProperties(org.clerk_id);
  const primaryColor = org.landing_primary_color || "#dc2626";
  const secondaryColor = org.landing_secondary_color || "#18181b";

  return (
    <PropertyList
      slug={slug}
      allProperties={JSON.parse(JSON.stringify(properties))}
      orgName={org.name}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
    />
  );
}
