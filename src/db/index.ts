import { neon } from "@neondatabase/serverless";
import { CREATE_ORGANIZATIONS_TABLE, CREATE_UPDATED_AT_FUNCTION, CREATE_UPDATED_AT_TRIGGER, ALTER_ORGANIZATIONS_LANDING } from "./schema";

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL nu este configurat.");
  return neon(url);
}

export async function initDb() {
  const db = sql();
  await db.query(CREATE_ORGANIZATIONS_TABLE);
  await db.query(CREATE_UPDATED_AT_FUNCTION);
  await db.query(CREATE_UPDATED_AT_TRIGGER);
  await db.query(ALTER_ORGANIZATIONS_LANDING);
}

export interface OrganizationRow {
  id: string;
  clerk_id: string;
  short_id: string;
  name: string;
  slug: string | null;
  logo_url: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  county: string | null;
  landing_enabled: boolean | null;
  landing_primary_color: string | null;
  landing_secondary_color: string | null;
  landing_about_text: string | null;
  landing_experience_years: string | null;
  company_name: string | null;
  cui: string | null;
  created_at: string;
  updated_at: string;
}

function generateShortId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < 8; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

export async function upsertOrganization(data: {
  clerkId: string;
  name: string;
  slug?: string;
  logoUrl?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  county?: string;
  landingEnabled?: boolean;
  landingPrimaryColor?: string;
  landingSecondaryColor?: string;
  landingAboutText?: string;
  landingExperienceYears?: string;
  companyName?: string;
  cui?: string;
}) {
  const db = sql();
  const shortId = generateShortId();

  await db`
    INSERT INTO organizations (clerk_id, short_id, name, slug, logo_url, email, phone, address, city, county, landing_enabled, landing_primary_color, landing_secondary_color, landing_about_text, landing_experience_years, company_name, cui)
    VALUES (${data.clerkId}, ${shortId}, ${data.name}, ${data.slug ?? null}, ${data.logoUrl ?? null}, ${data.email ?? null}, ${data.phone ?? null}, ${data.address ?? null}, ${data.city ?? null}, ${data.county ?? null}, ${data.landingEnabled ?? null}, ${data.landingPrimaryColor ?? null}, ${data.landingSecondaryColor ?? null}, ${data.landingAboutText ?? null}, ${data.landingExperienceYears ?? null}, ${data.companyName ?? null}, ${data.cui ?? null})
    ON CONFLICT (clerk_id)
    DO UPDATE SET
      name = EXCLUDED.name,
      slug = EXCLUDED.slug,
      logo_url = EXCLUDED.logo_url,
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      address = EXCLUDED.address,
      city = EXCLUDED.city,
      county = EXCLUDED.county,
      landing_enabled = EXCLUDED.landing_enabled,
      landing_primary_color = EXCLUDED.landing_primary_color,
      landing_secondary_color = EXCLUDED.landing_secondary_color,
      landing_about_text = EXCLUDED.landing_about_text,
      landing_experience_years = EXCLUDED.landing_experience_years,
      company_name = EXCLUDED.company_name,
      cui = EXCLUDED.cui;
  `;

  return shortId;
}

export async function getOrganizationByShortId(shortId: string): Promise<OrganizationRow | null> {
  const db = sql();
  const rows = await db`SELECT * FROM organizations WHERE short_id = ${shortId}`;
  return (rows[0] as OrganizationRow) ?? null;
}

export async function getOrganizationBySlug(slug: string): Promise<OrganizationRow | null> {
  const db = sql();
  const rows = await db`SELECT * FROM organizations WHERE slug = ${slug} AND landing_enabled = true`;
  return (rows[0] as OrganizationRow) ?? null;
}

export async function getAllOrganizations(): Promise<OrganizationRow[]> {
  const db = sql();
  const rows = await db`SELECT * FROM organizations ORDER BY created_at DESC`;
  return rows as OrganizationRow[];
}

export async function getPropertiesByOrgId(orgId: string) {
  const db = sql();
  const rows = await db`SELECT * FROM proprietati WHERE org_id = ${orgId} AND status = 'activ' ORDER BY created_at DESC`;
  return rows;
}
