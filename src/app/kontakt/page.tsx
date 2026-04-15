import Link from "next/link";

// TODO MVP: Replace form with actual email/CRM integration (e.g. Resend, SendGrid, or HubSpot)

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
          Kontakt oss
        </h1>
        <p className="mt-3 text-ink-light max-w-lg mx-auto">
          Har du spørsmål om Sportsbyttet, klubbregistrering eller samarbeid?
          Vi svarer vanligvis innen 24 timer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Contact form */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="font-display text-xl font-semibold text-ink mb-6">
            Send oss en melding
          </h2>

          <form className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-ink mb-1.5">Navn *</label>
                <input id="name" type="text" className="w-full rounded-lg border border-cream-dark px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">E-post *</label>
                <input id="email" type="email" placeholder="din@epost.no" className="w-full rounded-lg border border-cream-dark px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest" />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-ink mb-1.5">Emne</label>
              <select id="subject" className="w-full rounded-lg border border-cream-dark px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest">
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
                placeholder="Fortell oss hva vi kan hjelpe med..."
                className="w-full rounded-lg border border-cream-dark px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest resize-none"
              />
            </div>

            {/* TODO MVP: Wire up form submission */}
            <button
              type="button"
              className="w-full rounded-full bg-forest py-3 text-sm font-semibold text-white hover:bg-forest-light transition-colors"
            >
              Send melding
            </button>
          </form>
        </div>

        {/* Contact info sidebar */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-display text-lg font-semibold text-ink mb-4">
              Kontaktinfo
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-forest mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-ink">E-post</p>
                  <p className="text-sm text-ink-muted">hei@sportsbyttet.no</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-forest mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-ink">Adresse</p>
                  <p className="text-sm text-ink-muted">Bergen, Norge</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-forest/5 rounded-xl p-6">
            <h3 className="font-display text-lg font-semibold text-ink mb-2">
              For klubber
            </h3>
            <p className="text-sm text-ink-light mb-4">
              Vil du registrere klubben din? Vi hjelper deg med oppsett og
              lansering.
            </p>
            <Link
              href="/registrer-klubb"
              className="text-sm font-semibold text-forest hover:text-forest-light transition-colors"
            >
              Registrer klubb →
            </Link>
          </div>

          <div className="bg-amber/10 rounded-xl p-6">
            <h3 className="font-display text-lg font-semibold text-ink mb-2">
              Responstid
            </h3>
            <p className="text-sm text-ink-light">
              Vi svarer vanligvis innen <strong>24 timer</strong> på
              hverdager. For akutte saker, ring oss direkte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
