"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie_consent")) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 md:bottom-4 md:left-4 md:right-auto">
      <div className="bg-ink text-white rounded-2xl shadow-2xl max-w-sm w-full p-5 space-y-4">
        <div>
          <p className="text-sm font-semibold mb-1.5">Informasjonskapsler 🍪</p>
          <p className="text-xs text-white/70 leading-relaxed">
            Vi bruker nødvendige informasjonskapsler for innlogging (Supabase) og
            sikker betaling (Stripe). Ingen sporings- eller reklamekapsler.
          </p>
        </div>

        <div className="rounded-xl bg-white/10 px-4 py-3 text-xs text-white/60 leading-relaxed">
          <strong className="text-white/80 font-semibold block mb-1">Ansvarsfraskrivelse</strong>
          Sportsbytte er en markedsplass som kobler kjøpere og selgere.
          Vi er ikke ansvarlige for tvister, mangler eller tap knyttet til
          transaksjoner mellom brukere. Betaling håndteres av Stripe.
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={accept}
            className="flex-1 rounded-lg bg-forest py-2.5 text-xs font-semibold text-white hover:bg-forest-mid transition-colors"
          >
            Godta og lukk
          </button>
          <Link
            href="/personvern"
            className="flex-1 rounded-lg border border-white/20 py-2.5 text-xs font-semibold text-white/70 hover:text-white text-center transition-colors"
          >
            Les mer
          </Link>
        </div>
      </div>
    </div>
  );
}
