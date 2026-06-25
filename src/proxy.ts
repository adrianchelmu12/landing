import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isDashboard = createRouteMatcher(["/dashboard(.*)"]);
const isApiRoute = createRouteMatcher(["/api/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isApiRoute(req)) {
    if (req.method === "OPTIONS") return;
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Neautentificat" }, { status: 401 });
    }
  } else if (isDashboard(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
