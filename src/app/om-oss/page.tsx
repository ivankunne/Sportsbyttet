import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
        Om Sportsbyttet
      </h1>

      <div className="mt-8 prose prose-lg max-w-none">
        <p className="text-ink-light leading-relaxed text-lg">
          Sportsbyttet er Norges markedsplass for brukt sportsutstyr — bygget
          rundt idrettsklubbene. Vi tror at det beste utstyret allerede finnes
          i boden til noen i klubben din.
        </p>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-ink mb-4">
          Vår historie
        </h2>
        <p className="text-ink-light leading-relaxed">
          Ideen til Sportsbyttet kom en høstdag i Bergen. En skitrener la merke
          til at halve garderoben til juniorlaget var fullt av utstyr barna hadde
          vokst ut av, mens nye foreldre desperat lette etter rimelig utstyr for
          sesongen. Løsningen burde vært enkel — men Finn.no er for upersonlig
          og Facebook-grupper for kaotiske.
        </p>
        <p className="mt-4 text-ink-light leading-relaxed">
          Vi bygde Sportsbyttet for å gi hver klubb sin egen digitale
          byttebod. Et trygt sted der du vet hvem som selger, fordi dere
          tilhører samme fellesskap. Med Vipps-betaling og Bring-frakt er
          handelen like enkel som å bestille noe fra en nettbutikk — men med
          den tryggheten som kun klubbtilhørighet gir.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-ink mb-6">
          Hva vi står for
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              title: "Klubben først",
              desc: "Alt vi gjør starter med klubben. Hver funksjon vi lager spør vi: gjør dette klubbopplevelsen bedre?",
            },
            {
              title: "Bærekraft i praksis",
              desc: "Brukt er det nye nye. Ved å gi utstyr et nytt liv reduserer vi avfall og gjør sport tilgjengelig for flere.",
            },
            {
              title: "Trygghet i handel",
              desc: "Vipps-betaling, kjøperbeskyttelse og Bring-frakt. Du handler trygt med folk du deler garderobe med.",
            },
            {
              title: "Norsk og lokal",
              desc: "Vi er et norsk selskap, bygget for norske forhold. All support på norsk, og vi forstår idrettsklubber.",
            },
          ].map((value) => (
            <div key={value.title} className="bg-white rounded-xl p-5">
              <h3 className="font-display text-lg font-semibold text-ink">{value.title}</h3>
              <p className="mt-2 text-sm text-ink-light leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-ink mb-4">
          Teamet
        </h2>
        <p className="text-ink-light leading-relaxed">
          Vi er et lite team basert i Bergen med bakgrunn fra idrettslag,
          teknologi og design. Sammen har vi erfaring fra organisasjoner som
          bygger digitale produkter for norske forbrukere.
        </p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Ivan", role: "Grunnlegger & Produkt" },
            { name: "Marte", role: "Design" },
            { name: "Henrik", role: "Utvikling" },
            { name: "Sofie", role: "Partnerskap" },
          ].map((person) => (
            <div key={person.name} className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-forest/10 flex items-center justify-center text-forest font-bold font-display text-lg">
                {person.name[0]}
              </div>
              <p className="mt-2 font-medium text-ink text-sm">{person.name}</p>
              <p className="text-xs text-ink-muted">{person.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 bg-forest/5 rounded-2xl p-8 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Bli med på reisen
        </h2>
        <p className="mt-2 text-ink-light max-w-md mx-auto">
          Vi leter alltid etter klubber som vil teste plattformen. Registrer
          din klubb i dag — det er helt gratis.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/registrer-klubb"
            className="rounded-full bg-amber px-7 py-3 text-sm font-semibold text-white hover:bg-amber-dark transition-colors"
          >
            Registrer din klubb
          </Link>
          <Link
            href="/kontakt"
            className="text-sm font-medium text-forest hover:text-forest-light transition-colors"
          >
            Eller ta kontakt →
          </Link>
        </div>
      </section>
    </div>
  );
}
