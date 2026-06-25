"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useOrganization, useOrganizationList, CreateOrganization } from "@clerk/nextjs";

export function AgencySettings() {
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { isLoaded: listLoaded, userMemberships } = useOrganizationList({
    userMemberships: true,
  });

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (organization) {
      const md = (organization.publicMetadata || {}) as Record<string, unknown>;
      const params = new URLSearchParams(window.location.search);
      const passedName = params.get("orgName") || "";
      setName(passedName || (md.agencyName as string) || organization.name || "");
      setAddress((md.agencyAddress as string) || "");
      setCity((md.agencyCity as string) || "");
      setCounty((md.agencyCounty as string) || "");
      setPhone((md.agencyPhone as string) || "");
      setEmail((md.agencyEmail as string) || "");
      setLogoPreview((md.agencyLogo as string) || organization.imageUrl || null);
      if (passedName) {
        window.history.replaceState({}, "", "/dashboard/settings");
      }
    }
  }, [organization]);

  const saveToApi = async (data: Record<string, unknown>) => {
    const res = await fetch("/api/org", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const text = await res.text();
      try {
        const err = JSON.parse(text);
        throw new Error(err.error || "Eroare server");
      } catch {
        throw new Error(`Eroare ${res.status}`);
      }
    }
    return res.json();
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!name.trim() || !organization?.id) return;
    setSaving(true);
    setMessage("");

    try {
      if (logoFile) {
        const formData = new FormData();
        formData.append("logo", logoFile);
        formData.append("name", name);
        formData.append("orgId", organization.id);
        formData.append("agencyAddress", address);
        formData.append("agencyCity", city);
        formData.append("agencyCounty", county);
        formData.append("agencyPhone", phone);
        formData.append("agencyEmail", email);
        const res = await fetch("/api/org", { method: "PUT", body: formData });
        if (!res.ok) {
          const text = await res.text();
          try { const err = JSON.parse(text); throw new Error(err.error || "Eroare server"); } catch { throw new Error(`Eroare ${res.status}`); }
        }
        const result = await res.json();
        if (result.imageUrl) setLogoPreview(result.imageUrl);
      } else {
        await saveToApi({
          orgId: organization.id,
          name,
          agencyName: name,
          agencyAddress: address,
          agencyCity: city,
          agencyCounty: county,
          agencyPhone: phone,
          agencyEmail: email,
        });
      }
      setMessage("Salvat cu succes.");
    } catch (err: any) {
      setMessage("Eroare: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!orgLoaded || !listLoaded) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userMemberships?.data?.length) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-border p-8 text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-6"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Înapoi la dashboard
        </Link>
        <h2 className="text-lg font-semibold text-foreground mb-3">Creează-ți agenția</h2>
        <p className="text-sm text-muted mb-6">
          Pentru a personaliza profilul și a accesa CRM-ul, creează mai întâi o agenție.
        </p>
        <CreateOrganization afterCreateOrganizationUrl="/dashboard/settings" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-border p-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Înapoi la dashboard
      </Link>

      <h2 className="text-xl font-semibold text-foreground mb-6">Profil agenție</h2>

      {message && (
        <div className={`p-3 rounded-xl text-sm mb-6 ${
          message.includes("succes") || message.includes("salvat") || message.includes("încărcat")
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Logo agenție
            </label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo"
                  className="w-16 h-16 rounded-xl object-cover border border-border"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-100 border border-border flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
              <div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-border text-foreground hover:bg-card transition-colors"
              >
                  {logoPreview && logoFile ? "Schimbă logo" : logoPreview ? "Schimbă logo" : "Alege logo"}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nume agenție
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Numele agenției tale"
              className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email contact
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@agentie.ro"
              className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Telefon
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0712 345 678"
              className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Adresă
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Strada și numărul"
              className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Localitate
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Oraș"
                className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Județ
              </label>
              <input
                type="text"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                placeholder="Județ"
                className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              {saving ? "Se salvează..." : "Salvează"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


