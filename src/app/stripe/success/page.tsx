"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const listingId = params.get("listing_id");

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest-light">
          <svg className="h-8 w-8 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Betaling fullført!</h1>
          <p className="mt-2 text-sm text-ink-light">
            Kjøpet ditt er registrert. Selgeren vil kontakte deg for å avtale levering.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {listingId && (
            <Link
              href={`/annonse/${listingId}`}
              className="rounded-lg bg-forest px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-mid transition-colors"
            >
              Se annonsen
            </Link>
          )}
          <Link
            href="/dashboard"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-ink hover:bg-cream transition-colors"
          >
            Gå til innboks
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function StripeSucessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
