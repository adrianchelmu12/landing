import { neon } from "@neondatabase/serverless";
import { notFound } from "next/navigation";
import PropertyDetailClient from "./PropertyDetailClient";

async function getOrg(slug: string) {
  try {
    const db = neon(process.env.DATABASE_URL!);
    const rows = await db`SELECT * FROM organizations WHERE slug = ${slug} AND landing_enabled = true LIMIT 1`;
    return rows[0] || null;
  } catch {
    return null;
  }
}

async function getProperty(id: string, orgId: string) {
  try {
    const db = neon(process.env.DATABASE_URL!);
    const rows = await db`SELECT * FROM proprietati WHERE id = ${parseInt(id)} AND org_id = ${orgId} AND status = 'activ' LIMIT 1`;
    return rows[0] || null;
  } catch {
    return null;
  }
}

async function getAgent(orgId: string) {
  try {
    const db = neon(process.env.DATABASE_URL!);
    const rows = await db`SELECT * FROM agenti WHERE org_id = ${orgId} LIMIT 1`;
    return rows[0] || null;
  } catch {
    return null;
  }
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const org = await getOrg(slug);

  if (!org) notFound();

  const property = await getProperty(id, org.clerk_id);
  if (!property) notFound();

  const agent = await getAgent(org.clerk_id);

  return (
    <PropertyDetailClient
      slug={slug}
      property={JSON.parse(JSON.stringify(property))}
      org={JSON.parse(JSON.stringify(org))}
      agent={agent ? JSON.parse(JSON.stringify(agent)) : null}
    />
  );
}
