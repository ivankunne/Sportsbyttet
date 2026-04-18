"use client";

import { useState, useEffect, useRef } from "react";
import { Logo } from "./Logo";
import { supabase } from "@/lib/supabase";

type Props = {
  onClose: () => void;
  onSuccess?: () => void;
};

export function LoginModal({ onClose, onSuccess }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email.trim(),
          password: form.password,
        });
        if (error) throw error;
      } else {
        if (!form.name.trim()) throw new Error("Skriv inn ditt navn");
        const { data, error } = await supabase.auth.signUp({
          email: form.email.trim(),
          password: form.password,
        });
        if (error) throw error;
        if (data.user) {
          const slug =
            form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") +
            "-" +
            Date.now().toString(36);
          await supabase.from("profiles").insert({
            auth_user_id: data.user.id,
            name: form.name.trim(),
            slug,
          });
        }
      }
      onSuccess?.();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Noe gikk galt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4"
    >
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 h-7 w-7 flex items-center justify-center rounded-full text-ink-light hover:bg-cream hover:text-ink transition-colors duration-[120ms]"
          aria-label="Lukk"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-6 pt-6 pb-8">
          <div className="text-center mb-6">
            <Logo variant="light" className="text-xl justify-center mb-3" />
            <h2 className="font-display text-xl font-bold text-ink">
              {mode === "login" ? "Logg inn på Sportsbyttet" : "Opprett konto"}
            </h2>
            <p className="mt-1 text-sm text-ink-light">
              Kjøp og selg brukt sportsutstyr i din klubb
            </p>
          </div>

          <div className="space-y-3">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-medium text-ink mb-1.5">
                  Fullt navn
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ola Nordmann"
                  className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">E-post</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="deg@epost.no"
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Passord</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
              />
            </div>
          </div>

          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              !form.email.trim() ||
              !form.password ||
              (mode === "signup" && !form.name.trim())
            }
            className="mt-4 w-full rounded-lg bg-forest py-2.5 text-sm font-semibold text-white hover:bg-forest-mid transition-colors duration-[120ms] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Laster..."
              : mode === "login"
              ? "Logg inn"
              : "Opprett konto"}
          </button>

          <p className="mt-4 text-center text-sm text-ink-light">
            {mode === "login" ? (
              <>
                Har du ikke konto?{" "}
                <button
                  onClick={() => { setMode("signup"); setError(""); }}
                  className="font-semibold text-forest hover:underline"
                >
                  Registrer deg
                </button>
              </>
            ) : (
              <>
                Har du allerede konto?{" "}
                <button
                  onClick={() => { setMode("login"); setError(""); }}
                  className="font-semibold text-forest hover:underline"
                >
                  Logg inn
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
