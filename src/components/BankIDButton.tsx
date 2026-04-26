"use client";

interface BankIDButtonProps {
  profileId: number;
  verified: boolean;
}

export default function BankIDButton({ profileId, verified }: BankIDButtonProps) {
  if (verified) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-forest-light px-4 py-3">
        <svg className="h-5 w-5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-forest">BankID verifisert</p>
          <p className="text-xs text-ink-light">Identiteten din er bekreftet</p>
        </div>
      </div>
    );
  }

  return (
    <a
      href={`/api/auth/bankid/verify?pid=${profileId}`}
      className="flex items-center justify-center gap-2.5 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      style={{ backgroundColor: "#003087" }}
    >
      <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14H9V10h2v6zm4 0h-2V10h2v6zM12 8a1 1 0 110-2 1 1 0 010 2z" />
      </svg>
      Verifiser med BankID
    </a>
  );
}
