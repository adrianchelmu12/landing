import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";

const getClerkClient = () => createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId) return Response.json({ error: "Neautentificat" }, { status: 401 });
  if (!orgId) return Response.json({ error: "Fara organizatie" }, { status: 400 });

  try {
    const clerk = getClerkClient();
    const [membershipList, invitationList] = await Promise.all([
      clerk.organizations.getOrganizationMembershipList({ organizationId: orgId, limit: 50 }),
      clerk.organizations.getOrganizationInvitationList({ organizationId: orgId, status: ["pending"], limit: 50 }),
    ]);
    const members = membershipList.data.map((m) => ({
      id: m.id,
      name: `${m.publicUserData?.firstName || ""} ${m.publicUserData?.lastName || ""}`.trim() || "—",
      email: m.publicUserData?.identifier,
      imageUrl: m.publicUserData?.imageUrl,
      role: m.role === "admin" ? "Administrator" : "Agent",
    }));
    const invitations = invitationList.data.map((inv) => ({
      id: inv.id,
      email: inv.emailAddress,
      role: inv.role === "admin" ? "Administrator" : "Agent",
      status: inv.status,
      createdAt: inv.createdAt,
    }));
    return Response.json({ members, invitations });
  } catch (err: any) {
    return Response.json({ error: err?.message || "Eroare server" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId, orgId } = await auth();
  if (!userId) return Response.json({ error: "Neautentificat" }, { status: 401 });
  if (!orgId) return Response.json({ error: "Fara organizatie" }, { status: 400 });

  try {
    const body = await req.json();
    const { email, role } = body;
    if (!email) return Response.json({ error: "Emailul este obligatoriu" }, { status: 400 });

    const clerkRole = role === "admin" ? "admin" : "basic_member";
    const clerk = getClerkClient();
    const inv = await clerk.organizations.createOrganizationInvitation({
      organizationId: orgId,
      inviterUserId: userId,
      emailAddress: email,
      role: clerkRole,
    });

    return Response.json({ id: inv.id, email: inv.emailAddress, status: inv.status, role }, { status: 201 });
  } catch (err: any) {
    console.error("Invite error:", err?.message);
    return Response.json({ error: err?.message || "Eroare server" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { userId, orgId } = await auth();
  if (!userId) return Response.json({ error: "Neautentificat" }, { status: 401 });
  if (!orgId) return Response.json({ error: "Fara organizatie" }, { status: 400 });

  try {
    const url = new URL(req.url);
    const invitationId = url.searchParams.get("invitationId");
    if (!invitationId) return Response.json({ error: "ID invitatie lipsa" }, { status: 400 });

    const clerk = getClerkClient();
    await clerk.organizations.revokeOrganizationInvitation({
      organizationId: orgId,
      invitationId,
      requestingUserId: userId,
    });

    return Response.json({ success: true });
  } catch (err: any) {
    console.error("Revoke error:", err?.message);
    return Response.json({ error: err?.message || "Eroare server" }, { status: 500 });
  }
}
