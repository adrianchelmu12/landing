import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { neon } from "@neondatabase/serverless";

const getClerkClient = () => createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

async function getCustomRoles(orgId: string) {
  try {
    const client = db();
    if (!client) return {};
    const rows = await client`SELECT email, custom_role FROM member_roles WHERE org_id = ${orgId}`;
    const map: Record<string, string> = {};
    for (const r of rows) map[r.email] = r.custom_role;
    return map;
  } catch {
    return {};
  }
}

async function saveCustomRole(orgId: string, email: string, role: string) {
  try {
    const client = db();
    if (!client) return;
    await client`INSERT INTO member_roles (org_id, email, custom_role) VALUES (${orgId}, ${email}, ${role}) ON CONFLICT (org_id, email) DO UPDATE SET custom_role = EXCLUDED.custom_role`;
  } catch (e: any) {
    console.error("member_roles insert error:", e?.message);
  }
}

function roleLabel(role: string, customRole?: string) {
  if (role === "admin") return "Administrator";
  if (customRole === "manager") return "Manager";
  if (customRole === "agent") return "Agent";
  return role === "basic_member" ? "Agent" : role;
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function DELETE(req: Request) {
  const { userId, orgId } = await auth();
  if (!userId) return Response.json({ error: "Neautentificat" }, { status: 401 });
  if (!orgId) return Response.json({ error: "Fără organizație" }, { status: 400 });

  try {
    const url = new URL(req.url);
    const invitationId = url.searchParams.get("invitationId");
    if (!invitationId) return Response.json({ error: "ID invitație lipsă" }, { status: 400 });

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

export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId) return Response.json({ error: "Neautentificat" }, { status: 401 });
  if (!orgId) return Response.json({ error: "Fără organizație" }, { status: 400 });

  try {
    const clerk = getClerkClient();

    const [membershipList, invitationList, customRoles] = await Promise.all([
      clerk.organizations.getOrganizationMembershipList({ organizationId: orgId, limit: 50 }),
      clerk.organizations.getOrganizationInvitationList({ organizationId: orgId, status: ["pending"], limit: 50 }),
      getCustomRoles(orgId),
    ]);

    const members = membershipList.data.map((m) => ({
      id: m.id,
      userId: m.publicUserData?.userId,
      name: `${m.publicUserData?.firstName || ""} ${m.publicUserData?.lastName || ""}`.trim() || m.publicUserData?.identifier || "—",
      email: m.publicUserData?.identifier,
      imageUrl: m.publicUserData?.imageUrl,
      role: roleLabel(m.role, customRoles[m.publicUserData?.identifier || ""]),
    }));

    const invitations = invitationList.data.map((inv) => ({
      id: inv.id,
      email: inv.emailAddress,
      role: roleLabel(inv.role, customRoles[inv.emailAddress]),
      status: inv.status,
      createdAt: inv.createdAt,
    }));

    return Response.json({ members, invitations });
  } catch (err: any) {
    console.error("Members error:", err?.message);
    return Response.json({ error: err?.message || "Eroare server" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  console.log("POST /api/org/members called");
  const { userId, orgId } = await auth();
  console.log("Auth result:", { userId, orgId });
  if (!userId) return Response.json({ error: "Neautentificat" }, { status: 401 });
  if (!orgId) return Response.json({ error: "Fără organizație" }, { status: 400 });

  try {
    const body = await req.json();
    const { email, role } = body;
    console.log("Body:", { email, role });
    if (!email) return Response.json({ error: "Emailul este obligatoriu" }, { status: 400 });

    const clerkRole = role === "admin" ? "admin" : "basic_member";

    const clerk = getClerkClient();
    const inv = await clerk.organizations.createOrganizationInvitation({
      organizationId: orgId,
      inviterUserId: userId,
      emailAddress: email,
      role: clerkRole,
    });

    await saveCustomRole(orgId, email, role || "agent");

    return Response.json({ id: inv.id, email: inv.emailAddress, status: inv.status, role }, { status: 201 });
  } catch (err: any) {
    console.error("Invite error:", err?.message, err?.stack);
    return Response.json({ error: err?.message || "Eroare server" }, { status: 500 });
  }
}

console.log("API route module loaded: members");
