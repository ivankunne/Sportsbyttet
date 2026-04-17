"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Noe gikk galt. Prøv igjen.");
        setSending(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Noe gikk galt. Prøv igjen.");
    }
    setSending(false);
  }

  if (sent) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-3">✉️</div>
        <h3 className="font-display text-xl font-semibold text-ink">Takk for meldingen!</h3>
        <p className="mt-2 text-sm text-ink-light">
          Vi svarer vanligvis innen 24 timer på hverdager.
        </p>
        <button
          onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
          className="mt-4 text-sm font-medium text-forest hover:text-forest-mid transition-colors duration-[120ms]"
        >
          Send en ny melding
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-ink mb-1.5">Navn *</label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">E-post *</label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="din@epost.no"
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-ink mb-1.5">Emne</label>
        <select
          id="subject"
          value={form.subject}
          onChange={(e) => set("subject", e.target.value)}
          className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
        >
          <option value="">Velg emne</option>
          <option>Generelt spørsmål</option>
          <option>Klubbregistrering</option>
          <option>Teknisk problem</option>
          <option>Samarbeid / Partnerskap</option>
          <option>Presse</option>
          <option>Annet</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ink mb-1.5">Melding *</label>
        <textarea
          id="message"
          rows={5}
          required
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Fortell oss hva vi kan hjelpe med..."
          className="w-full rounded-lg border border-border px-4 py-2.5 text-sm text-ink placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-lg bg-forest py-3 text-sm font-semibold text-white hover:bg-forest-mid transition-colors duration-[120ms] disabled:opacity-60"
      >
        {sending ? "Sender..." : "Send melding"}
      </button>
    </form>
  );
}
