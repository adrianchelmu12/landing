import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

export async function POST(req: Request) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: "Neautentificat" }, { status: 401 });
  }

  let email: string;
  try {
    const body = await req.json();
    email = body.email;
  } catch {
    return Response.json({ error: "Body invalid" }, { status: 400 });
  }

  if (!email || typeof email !== "string") {
    return Response.json({ error: "Email obligatoriu" }, { status: 400 });
  }

  try {
    const inv = await clerk.organizations.createOrganizationInvitation({
      organizationId: orgId,
      inviterUserId: userId,
      emailAddress: email.trim().toLowerCase(),
      role: "basic_member",
    });

    return Response.json({ ok: true, invitationId: inv.id }, { status: 201 });
  } catch (err: any) {
    return Response.json({ error: err?.message || "Eroare server" }, { status: 500 });
  }
}
