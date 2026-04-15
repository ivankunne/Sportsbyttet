import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-forest text-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-display text-2xl font-semibold text-white">
                <span className="text-3xl">S</span>portsbyttet
              </span>
            </Link>
            <p className="mt-3 text-sm text-white/60 max-w-md">
              Norges markedsplass for brukt sportsutstyr. Klubbmedlemmer kjøper
              og selger utstyr trygt — med Vipps-betaling og Bring-frakt.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Sportsbyttet</h4>
            <ul className="space-y-2">
              <li><Link href="/om-oss" className="text-sm hover:text-white transition-colors">Om oss</Link></li>
              <li><Link href="/kontakt" className="text-sm hover:text-white transition-colors">Kontakt</Link></li>
              <li><Link href="/personvern" className="text-sm hover:text-white transition-colors">Personvern</Link></li>
              <li><Link href="/vilkar" className="text-sm hover:text-white transition-colors">Vilkår</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-3">For klubber</h4>
            <ul className="space-y-2">
              <li><Link href="/registrer-klubb" className="text-sm hover:text-white transition-colors">Registrer klubb</Link></li>
              <li><Link href="/priser" className="text-sm hover:text-white transition-colors">Priser</Link></li>
              <li><Link href="/for-lagledere" className="text-sm hover:text-white transition-colors">For lagledere</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Sportsbyttet. Alle rettigheter reservert.
          </p>
          {/* TODO: Replace with actual partner logos when agreements are in place */}
          <p className="text-xs text-white/40">
            Trygg handel med Vipps og Bring
          </p>
        </div>
      </div>
    </footer>
  );
}
