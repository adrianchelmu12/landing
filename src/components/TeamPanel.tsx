"use client";

import { useState, useEffect, useCallback } from "react";
import { useOrganization } from "@clerk/nextjs";

interface Member {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
}

interface Invite {
  id: string;
  email: string;
  createdAt: number;
}

export function TeamPanel() {
  const { organization } = useOrganization();
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchTeam = useCallback(async () => {
    try {
      const res = await fetch("/api/team", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
        setInvites(data.invitations || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (organization) fetchTeam();
  }, [organization, fetchTeam]);

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setMsg("");

    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Eroare ${res.status}`);

      setInvites((prev) => [{ id: data.invitationId, email: email.trim(), createdAt: Date.now() }, ...prev]);
      setEmail("");
      setMsg("Invitația a fost trimisă.");
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setSending(false);
    }
  };

  const revoke = async (id: string) => {
    try {
      const res = await fetch(`/api/team?id=${id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        setInvites((prev) => prev.filter((i) => i.id !== id));
        setMsg("Revocată.");
      }
    } catch (err: any) {
      setMsg(err.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-border p-8 flex justify-center py-10">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-8">
      <h2 className="text-xl font-semibold text-foreground mb-6">Echipă</h2>

      {msg && (
        <div className={`p-3 rounded-xl text-sm mb-5 ${msg.includes("Eroare") || msg.includes("404") ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
          {msg}
        </div>
      )}

      <form onSubmit={invite} className="flex gap-2 mb-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email agent"
          disabled={sending}
          className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="submit"
          disabled={sending || !email.trim()}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50 shrink-0"
        >
          {sending ? "..." : "Invită"}
        </button>
      </form>

      {invites.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">În așteptare</p>
          <div className="space-y-1">
            {invites.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                <span className="text-sm text-foreground">{inv.email}</span>
                <button onClick={() => revoke(inv.id)} className="text-xs text-muted hover:text-red-600">Revocă</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Membri ({members.length})</p>
      {members.length === 0 ? (
        <p className="text-sm text-muted">Niciun membru.</p>
      ) : (
        <div className="space-y-1">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50">
              {m.image ? (
                <img src={m.image} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-primary">{m.name?.[0]?.toUpperCase() || "?"}</span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{m.name}</p>
                <p className="text-xs text-muted truncate">{m.email}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium shrink-0">{m.role}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
