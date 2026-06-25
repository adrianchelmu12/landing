import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: "Neautentificat" }, { status: 401 });
  }

  try {
    const [memberships, invites] = await Promise.all([
      clerk.organizations.getOrganizationMembershipList({ organizationId: orgId, limit: 50 }),
      clerk.organizations.getOrganizationInvitationList({ organizationId: orgId, status: ["pending"], limit: 50 }),
    ]);

    return Response.json({
      members: memberships.data.map((m) => ({
        id: m.id,
        name: [m.publicUserData?.firstName, m.publicUserData?.lastName].filter(Boolean).join(" ") || "—",
        email: m.publicUserData?.identifier,
        image: m.publicUserData?.imageUrl,
        role: m.role === "admin" ? "Administrator" : "Agent",
      })),
      invitations: invites.data.map((i) => ({
        id: i.id,
        email: i.emailAddress,
        createdAt: i.createdAt,
      })),
    });
  } catch (err: any) {
    return Response.json({ error: err?.message || "Eroare server" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: "Neautentificat" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const invitationId = searchParams.get("id");
  if (!invitationId) {
    return Response.json({ error: "ID lipsa" }, { status: 400 });
  }

  try {
    await clerk.organizations.revokeOrganizationInvitation({
      organizationId: orgId,
      invitationId,
      requestingUserId: userId,
    });
    return Response.json({ ok: true });
  } catch (err: any) {
    return Response.json({ error: err?.message || "Eroare server" }, { status: 500 });
  }
}
