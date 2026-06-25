import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { initDb, upsertOrganization } from "@/db";
import { neon } from "@neondatabase/serverless";

const getClerkClient = () => createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

async function syncToDb(clerkId: string, name: string, metadata: Record<string, unknown>, imageUrl?: string) {
  try {
    const client = db();
    if (!client) return;
    await initDb();
    await upsertOrganization({
      clerkId,
      name,
      slug: undefined,
      logoUrl: imageUrl ?? (metadata.agencyLogo as string) ?? undefined,
      email: (metadata.agencyEmail as string) ?? undefined,
      phone: (metadata.agencyPhone as string) ?? undefined,
      address: (metadata.agencyAddress as string) ?? undefined,
      city: (metadata.agencyCity as string) ?? undefined,
      county: (metadata.agencyCounty as string) ?? undefined,
    });
  } catch (err: any) {
    console.error("Neon sync error:", err?.message);
  }
}

async function addCreatorAsAgent(userId: string, orgId: string) {
  if (!process.env.DATABASE_URL) return;
  try {
    const client = db();
    if (!client) return;
    const clerk = getClerkClient();
    const user = await clerk.users.getUser(userId);
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.emailAddresses[0]?.emailAddress || "Admin";
    const email = user.emailAddresses[0]?.emailAddress || "";

    const orgShortId = await client`SELECT short_id FROM organizations WHERE clerk_id = ${orgId}`.then(r => r[0]?.short_id);
    console.log("Adding creator as admin:", { userId, orgId, name, email, orgShortId });

    await initDb();
    await client`
      INSERT INTO agenti (org_id, org_short_id, user_id, nume, email, rol)
      VALUES (${orgId}, ${orgShortId || null}, ${userId}, ${name}, ${email}, 'admin')
    `;
    console.log("Creator added as admin successfully");
  } catch (err: any) {
    console.error("Agent insert error:", err?.message, err?.stack);
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Neautentificat" }, { status: 401 });

  try {
    const body = await req.json();
    const { name } = body;
    if (!name) return Response.json({ error: "Numele este obligatoriu" }, { status: 400 });

    const clerk = getClerkClient();
    const org = await clerk.organizations.createOrganization({
      name,
      createdBy: userId,
      roleSetKey: "role_set:default",
    });

    await clerk.organizations.createOrganizationMembership({
      organizationId: org.id,
      userId,
      role: "admin",
    });

    await clerk.organizations.updateOrganization(org.id, {
      publicMetadata: { agencyName: name },
    } as any);

    await syncToDb(org.id, name, { agencyName: name });
    await addCreatorAsAgent(userId, org.id);

    return Response.json(org, { status: 201 });
  } catch (err: any) {
    console.error("Create org error:", err?.message);
    return Response.json({ error: err?.message || "Eroare server" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { userId, orgId: authOrgId } = await auth();

  if (!userId) return Response.json({ error: "Neautentificat" }, { status: 401 });

  try {
    const contentType = req.headers.get("content-type") || "";
    const clerk = getClerkClient();
    let orgId = authOrgId;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const name = formData.get("name") as string;
      const logo = formData.get("logo") as File;
      orgId = (formData.get("orgId") as string) || orgId;

      if (!orgId) return Response.json({ error: "Fără organizație" }, { status: 400 });

      const metaFields: Record<string, unknown> = {};
      const address = formData.get("agencyAddress") as string;
      const city = formData.get("agencyCity") as string;
      const county = formData.get("agencyCounty") as string;
      const phone = formData.get("agencyPhone") as string;
      const email = formData.get("agencyEmail") as string;

      if (address) metaFields.agencyAddress = address;
      if (city) metaFields.agencyCity = city;
      if (county) metaFields.agencyCounty = county;
      if (phone) metaFields.agencyPhone = phone;
      if (email) metaFields.agencyEmail = email;

      if (name) metaFields.agencyName = name;

      const current = await clerk.organizations.getOrganization({ organizationId: orgId });
      const currentMeta = (current.publicMetadata || {}) as Record<string, unknown>;
      const mergedMeta = { ...currentMeta, ...metaFields };

      let newLogoUrl: string | undefined;

      if (logo?.size > 0) {
        const logoResult = await clerk.organizations.updateOrganizationLogo(orgId, {
          file: logo,
          uploaderUserId: userId,
        });
        mergedMeta.agencyLogo = logoResult.imageUrl;
        newLogoUrl = logoResult.imageUrl;
        await clerk.organizations.updateOrganization(orgId, {
          ...(name ? { name } : {}),
          publicMetadata: mergedMeta,
        } as any);
      }

      if (name || Object.keys(metaFields).length > 0 || logo?.size) {
        if (!logo?.size) {
          await clerk.organizations.updateOrganization(orgId, {
            ...(name ? { name } : {}),
            publicMetadata: mergedMeta,
          } as any);
        }

        await syncToDb(orgId, name || current.name, mergedMeta, newLogoUrl);
        return Response.json({ name: name || current.name, imageUrl: newLogoUrl || current.imageUrl });
      }
      return Response.json({ error: "Niciun fișier" }, { status: 400 });
    }

    const body = await req.json();
    orgId = body.orgId || orgId;
    if (!orgId) return Response.json({ error: "Fără organizație" }, { status: 400 });

    const { name, agencyName, agencyAddress, agencyCity, agencyCounty, agencyPhone, agencyEmail } = body;
    const current = await clerk.organizations.getOrganization({ organizationId: orgId });
    const currentMeta = (current.publicMetadata || {}) as Record<string, unknown>;

    const publicMetadata: Record<string, unknown> = { ...currentMeta };
    if (agencyName !== undefined) publicMetadata.agencyName = agencyName;
    if (agencyAddress !== undefined) publicMetadata.agencyAddress = agencyAddress;
    if (agencyCity !== undefined) publicMetadata.agencyCity = agencyCity;
    if (agencyCounty !== undefined) publicMetadata.agencyCounty = agencyCounty;
    if (agencyPhone !== undefined) publicMetadata.agencyPhone = agencyPhone;
    if (agencyEmail !== undefined) publicMetadata.agencyEmail = agencyEmail;

    const updated = await clerk.organizations.updateOrganization(orgId, {
      ...(name ? { name } : {}),
      publicMetadata,
    } as any);

    await syncToDb(orgId, name || current.name, publicMetadata, undefined);

    return Response.json(updated);
  } catch (err: any) {
    return Response.json({ error: err?.message || "Eroare server" }, { status: 500 });
  }
}
