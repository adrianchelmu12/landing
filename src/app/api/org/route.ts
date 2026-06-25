import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";

const getClerkClient = () => createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

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
    });

    await clerk.organizations.createOrganizationMembership({
      organizationId: org.id,
      userId,
      role: "admin",
    });

    await clerk.organizations.updateOrganization(org.id, {
      publicMetadata: { agencyName: name },
    } as any);

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

      if (logo?.size > 0) {
        const logoResult = await clerk.organizations.updateOrganizationLogo(orgId, {
          file: logo,
          uploaderUserId: userId,
        });
        mergedMeta.agencyLogo = logoResult.imageUrl;
        await clerk.organizations.updateOrganization(orgId, {
          ...(name ? { name } : {}),
          publicMetadata: mergedMeta,
        } as any);
        return Response.json({ name: logoResult.name, imageUrl: logoResult.imageUrl });
      }

      if (name || Object.keys(metaFields).length > 0) {
        const updated = await clerk.organizations.updateOrganization(orgId, {
          ...(name ? { name } : {}),
          publicMetadata: mergedMeta,
        } as any);
        return Response.json({ name: updated.name, imageUrl: updated.imageUrl });
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

    return Response.json(updated);
  } catch (err: any) {
    return Response.json({ error: err?.message || "Eroare server" }, { status: 500 });
  }
}
