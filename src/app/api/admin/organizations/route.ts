import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";

const getClerkClient = () => createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

export async function GET() {
  const { userId } = await auth();

  if (!userId) return Response.json({ error: "Neautentificat" }, { status: 401 });

  if (userId !== process.env.NEXT_PUBLIC_SUPER_ADMIN_USER_ID) {
    return Response.json({ error: "Acces interzis" }, { status: 403 });
  }

  try {
    const clerk = getClerkClient();
    const orgs = await clerk.organizations.getOrganizationList({ limit: 100 });

    const detailed = await Promise.all(
      orgs.data.map(async (org) => {
        try {
          const members = await clerk.organizations.getOrganizationMembershipList({
            organizationId: org.id,
            limit: 50,
          });
          const meta = (org.publicMetadata || {}) as Record<string, unknown>;
          return {
            id: org.id,
            name: org.name,
            slug: org.slug,
            imageUrl: org.imageUrl,
            membersCount: members.totalCount,
            agencyName: meta.agencyName || org.name,
            agencyCity: meta.agencyCity || "",
            agencyCounty: meta.agencyCounty || "",
            agencyPhone: meta.agencyPhone || "",
            agencyEmail: meta.agencyEmail || "",
            createdAt: org.createdAt,
          };
        } catch {
          return { id: org.id, name: org.name, slug: org.slug, imageUrl: org.imageUrl, error: true };
        }
      })
    );

    return Response.json(detailed);
  } catch (err: any) {
    return Response.json({ error: err?.message || "Eroare server" }, { status: 500 });
  }
}
