"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { formatDaysAgo } from "@/lib/queries";
import type { Announcement } from "@/lib/queries";

type Props = {
  clubId: number;
  isAdmin?: boolean;
};

const typeConfig: Record<string, { label: string; classes: string }> = {
  announcement: { label: "Kunngjøring", classes: "bg-forest text-white" },
  event: { label: "Arrangement", classes: "bg-amber text-white" },
  gear: { label: "Utstyr", classes: "bg-forest-light text-forest" },
};

export function ClubAnnouncements({ clubId, isAdmin = false }: Props) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    body: "",
    type: "announcement",
    author_name: "",
  });

  const fetchAnnouncements = useCallback(async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .eq("club_id", clubId)
      .order("created_at", { ascending: false })
      .limit(10);
    setAnnouncements(data ?? []);
    setLoading(false);
  }, [clubId]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  async function handleCreate(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("announcements").insert({
      club_id: clubId,
      title: form.title.trim(),
      body: form.body.trim(),
      type: form.type,
      author_name: form.author_name.trim() || null,
    });
    if (!error) {
      setForm({ title: "", body: "", type: "announcement", author_name: "" });
      setShowForm(false);
      await fetchAnnouncements();
    }
    setSubmitting(false);
  }

  async function handleDelete(id: number) {
    await supabase.from("announcements").delete().eq("id", id);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  }

  if (loading) return null;
  if (!isAdmin && announcements.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-xl font-semibold text-ink">Oppslag fra klubben</h3>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-sm font-medium text-forest hover:text-forest-mid transition-colors duration-[120ms]"
          >
            {showForm ? "Avbryt" : "+ Nytt oppslag"}
          </button>
        )}
      </div>

      {/* Create form — admin only */}
      {isAdmin && showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 bg-white rounded-xl border border-border p-6 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Tittel</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="F.eks. Sesongstart 2026"
                required
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-ink placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              >
                <option value="announcement">Kunngjøring</option>
                <option value="event">Arrangement</option>
                <option value="gear">Utstyr</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Melding</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={3}
              required
              placeholder="Skriv innholdet i oppslaget her..."
              className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-ink placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Avsender (valgfritt)</label>
            <input
              type="text"
              value={form.author_name}
              onChange={(e) => setForm({ ...form, author_name: e.target.value })}
              placeholder="F.eks. Styret"
              className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-ink placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-ink-mid hover:bg-cream transition-colors duration-[120ms]"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-forest text-sm font-semibold text-white hover:bg-forest-mid transition-colors duration-[120ms] disabled:opacity-50"
            >
              {submitting ? "Publiserer..." : "Publiser oppslag"}
            </button>
          </div>
        </form>
      )}

      {isAdmin && announcements.length === 0 && !showForm && (
        <p className="text-sm text-ink-light">
          Ingen oppslag ennå.{" "}
          <button onClick={() => setShowForm(true)} className="text-forest hover:underline">
            Opprett ditt første oppslag
          </button>
        </p>
      )}

      <div className="space-y-4">
        {announcements.map((a) => {
          const config = typeConfig[a.type] ?? typeConfig.announcement;
          return (
            <div key={a.id} className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${config.classes}`}>
                    {config.label}
                  </span>
                  <h4 className="font-display text-base font-semibold text-ink">{a.title}</h4>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-xs text-ink-light hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    Slett
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm text-ink-mid leading-relaxed">{a.body}</p>
              <p className="mt-3 text-xs text-ink-light">
                {a.author_name ? `${a.author_name} · ` : ""}
                {formatDaysAgo(a.created_at)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
