"use client";

import { useState, useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";

interface Member {
  id: string;
  userId: string;
  name: string;
  email: string;
  imageUrl: string | null;
  role: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: number;
}

export function TeamSection() {
  const { organization } = useOrganization();
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("agent");
  const [inviting, setInviting] = useState(false);
  const [message, setMessage] = useState("");

  const loadTeam = async () => {
    try {
      const res = await fetch("/api/org/members");
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
        setInvitations(data.invitations || []);
      }
    } catch (err: any) {
      console.error("Load team error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organization) {
      loadTeam();
    }
  }, [organization]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setInviting(true);
    setMessage("");

    try {
      const res = await fetch("/api/org/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Eroare la trimiterea invitației.");
      }

      const inv = await res.json();
      setInvitations((prev) => [...prev, { ...inv, status: "pending", createdAt: Date.now() }]);
      setEmail("");
      setMessage("Invitație trimisă.");
    } catch (err: any) {
      setMessage("Eroare: " + err.message);
    } finally {
      setInviting(false);
    }
  };

  const handleDeleteInvitation = async (invitationId: string) => {
    try {
      const res = await fetch(`/api/org/members?invitationId=${invitationId}`, { method: "DELETE" });
      if (res.ok) {
        setInvitations((prev) => prev.filter((i) => i.id !== invitationId));
        setMessage("Invitația a fost revocată.");
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage("Eroare: " + (data.error || "Nu s-a putut revoca."));
      }
    } catch (err: any) {
      setMessage("Eroare: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-border p-8">
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="bg-white rounded-2xl border border-border p-8">
        <p className="text-sm text-muted text-center">Creează o agenție pentru a gestiona echipa.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-8">
      <h2 className="text-xl font-semibold text-foreground mb-6">Echipă</h2>

      {message && (
        <div className={`p-3 rounded-xl text-sm mb-6 ${message.includes("Eroare") ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleInvite} className="flex gap-3 mb-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email-ul agentului"
          disabled={inviting}
          className="flex-1 px-4 py-3 rounded-xl border border-border text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={inviting}
          className="px-3 py-3 rounded-xl border border-border text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 shrink-0"
        >
          <option value="agent">Agent</option>
          <option value="manager">Manager</option>
          <option value="admin">Administrator</option>
        </select>
        <button
          type="submit"
          disabled={inviting || !email.trim()}
          className="px-5 py-3 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50 shrink-0"
        >
          {inviting ? "Se trimite..." : "Invita"}
        </button>
      </form>

      {invitations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">Invitații în așteptare</h3>
          <div className="space-y-2">
            {invitations.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{inv.email}</p>
                    <p className="text-xs text-amber-600">În așteptare</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteInvitation(inv.id)}
                  className="text-xs text-muted hover:text-red-600 transition-colors"
                >
                  Revocă
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
        Membri ({members.length})
      </h3>

      {members.length === 0 ? (
        <p className="text-sm text-muted">Niciun membru în echipă.</p>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              {member.imageUrl ? (
                <img src={member.imageUrl} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-primary">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                <p className="text-xs text-muted truncate">{member.email}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize shrink-0">
                {member.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
