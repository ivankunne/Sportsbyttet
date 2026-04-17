"use client";

import { useState } from "react";

export function ProfileMessageButton({ sellerName }: { sellerName: string }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  function handleClose() {
    setOpen(false);
    setTimeout(() => { setSent(false); setForm({ name: "", email: "", message: "" }); }, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    setSent(true);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border-2 border-forest px-6 py-2 text-sm font-semibold text-forest hover:bg-forest hover:text-white transition-colors duration-[120ms]"
      >
        Send melding
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="font-display text-base font-bold text-ink">Send melding</h2>
                <p className="text-xs text-ink-light mt-0.5">til {sellerName}</p>
              </div>
              <button onClick={handleClose} className="text-ink-light hover:text-ink transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {sent ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-light">
                    <svg className="h-6 w-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <p className="font-display text-base font-semibold text-ink">Melding sendt!</p>
                  <p className="text-sm text-ink-light">{sellerName} vil svare deg på e-post.</p>
                  <button
                    onClick={handleClose}
                    className="mt-2 rounded-lg bg-forest px-6 py-2 text-sm font-semibold text-white hover:bg-forest-mid transition-colors duration-[120ms]"
                  >
                    Lukk
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-ink mb-1.5">Ditt navn</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Ola Nordmann"
                        className="w-full rounded-lg border border-border px-3 py-2 text-sm text-ink placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ink mb-1.5">E-post</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="ola@example.com"
                        className="w-full rounded-lg border border-border px-3 py-2 text-sm text-ink placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink mb-1.5">Melding</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={`Hei ${sellerName}, jeg er interessert i...`}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm text-ink placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full rounded-lg bg-forest py-2.5 text-sm font-semibold text-white hover:bg-forest-mid transition-colors duration-[120ms] disabled:opacity-60"
                  >
                    {sending ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sender...
                      </span>
                    ) : "Send melding"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
