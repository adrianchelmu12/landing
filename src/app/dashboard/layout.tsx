import { currentUser } from "@clerk/nextjs/server";
import { DashboardNav } from "@/components/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <a href="https://landing-nu-ochre-22.vercel.app" className="text-sm text-muted hover:text-foreground transition-colors flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Pagina principală
              </a>
              <a href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="14" width="8" height="16" rx="2" fill="var(--primary)" />
                  <rect x="12" y="8" width="8" height="22" rx="2" fill="var(--primary)" opacity="0.8" />
                  <rect x="22" y="2" width="8" height="28" rx="2" fill="var(--primary)" opacity="0.6" />
                </svg>
                Imobify
              </a>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-muted hidden sm:block">
                  {user.firstName || user.emailAddresses[0]?.emailAddress}
                </span>
              )}
              <DashboardNav />
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
