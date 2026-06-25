import { neon } from "@neondatabase/serverless";
import { CREATE_ORGANIZATIONS_TABLE, CREATE_UPDATED_AT_FUNCTION, CREATE_UPDATED_AT_TRIGGER } from "./schema";

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
}

export interface OrganizationRow {
  id: string;
  clerk_id: string;
  name: string;
  slug: string | null;
  logo_url: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  county: string | null;
  created_at: string;
  updated_at: string;
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
}) {
  const db = sql();
  await db`
    INSERT INTO organizations (clerk_id, name, slug, logo_url, email, phone, address, city, county)
    VALUES (${data.clerkId}, ${data.name}, ${data.slug ?? null}, ${data.logoUrl ?? null}, ${data.email ?? null}, ${data.phone ?? null}, ${data.address ?? null}, ${data.city ?? null}, ${data.county ?? null})
    ON CONFLICT (clerk_id)
    DO UPDATE SET
      name = EXCLUDED.name,
      slug = EXCLUDED.slug,
      logo_url = EXCLUDED.logo_url,
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      address = EXCLUDED.address,
      city = EXCLUDED.city,
      county = EXCLUDED.county;
  `;
}

export async function getAllOrganizations(): Promise<OrganizationRow[]> {
  const db = sql();
  const rows = await db`SELECT * FROM organizations ORDER BY created_at DESC`;
  return rows as OrganizationRow[];
}
