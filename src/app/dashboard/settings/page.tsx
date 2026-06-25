import { AgencySettings } from "@/components/AgencySettings";

export default function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Setări agenție</h1>
        <p className="mt-1 text-muted">Configurează profilul agenției tale. Aceste informații vor apărea în CRM.</p>
      </div>
      <AgencySettings />
    </div>
  );
}
