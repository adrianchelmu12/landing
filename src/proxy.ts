import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";

async function getOrgBySlug(slug: string) {
  try {
    const db = neon(process.env.DATABASE_URL!);
    const rows = await db`SELECT clerk_id FROM organizations WHERE slug = ${slug} AND landing_enabled = true LIMIT 1`;
    return rows[0]?.clerk_id || null;
  } catch {
    return null;
  }
}

const isDashboard = createRouteMatcher(["/dashboard(.*)"]);
const isApiRoute = createRouteMatcher(["/api/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const host = req.headers.get("host") || "";
  const mainDomain = process.env.MAIN_DOMAIN || "imobify.ro";

  if (host.endsWith(`.${mainDomain}`) && host !== mainDomain && !host.startsWith("www.")) {
    const slug = host.replace(`.${mainDomain}`, "");

    if (slug && !slug.includes(".") && slug.length > 0) {
      if (req.nextUrl.pathname.startsWith("/_next") || req.nextUrl.pathname.startsWith("/api")) {
        return NextResponse.next();
      }

      const orgId = await getOrgBySlug(slug);
      if (orgId) {
        const rewriteUrl = new URL(`/${slug}${req.nextUrl.pathname}`, req.url);
        const rewrite = NextResponse.rewrite(rewriteUrl);
        rewrite.headers.set("x-org-slug", slug);
        rewrite.headers.set("x-org-id", orgId);
        return rewrite;
      }

      return NextResponse.redirect(new URL(`https://${mainDomain}`, req.url));
    }
  }

  if (isApiRoute(req)) {
    if (req.method === "OPTIONS") return NextResponse.next();
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Neautentificat" }, { status: 401 });
    }
  } else if (isDashboard(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|mp4|webm)).*)"],
};
