import {
  getAllClubs,
  getClubBySlug,
  getListingsByClub,
  getProfilesByClub,
} from "@/lib/queries";
import { ClubListings } from "@/components/ClubListings";
import Link from "next/link";

export const revalidate = 60;

export async function generateStaticParams() {
  const clubs = await getAllClubs();
  return clubs.map((club) => ({ slug: club.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};


export default async function ClubPage({ params }: Props) {
  const { slug } = await params;

  const club = await getClubBySlug(slug);
  if (!club) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Klubb ikke funnet</h1>
        <Link href="/" className="mt-4 inline-block text-forest hover:underline">
          Tilbake til forsiden
        </Link>
      </div>
    );
  }

  const [listings, sellers] = await Promise.all([
    getListingsByClub(club.id),
    getProfilesByClub(club.id),
  ]);

  return (
    <>
      {/* Club banner */}
      <section
        className="relative grain-overlay"
        style={{ backgroundColor: club.color }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-white text-2xl font-bold font-display border-2 border-white/30">
              {club.initials}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white">
                {club.name}
              </h1>
              <p className="mt-1 text-white/70 text-sm">
                {club.members.toLocaleString("nb-NO")} medlemmer • {club.active_listings} aktive annonser
              </p>
            </div>
            <div className="flex gap-3">
              <button className="rounded-full bg-white/20 px-5 py-2 text-sm font-medium text-white hover:bg-white/30 transition-colors backdrop-blur-sm">
                Del klubbside
              </button>
              <button className="rounded-full bg-amber px-5 py-2 text-sm font-semibold text-white hover:bg-amber-dark transition-colors">
                Bli med i klubben
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Club stats */}
      <section className="bg-white border-b border-cream-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-6 sm:gap-12 text-center">
            <div>
              <span className="text-xl font-bold font-display text-forest">{club.active_listings}</span>
              <span className="ml-1.5 text-sm text-ink-muted">aktive annonser</span>
            </div>
            <div className="w-px h-5 bg-cream-dark" />
            <div>
              <span className="text-xl font-bold font-display text-forest">{club.total_sold}</span>
              <span className="ml-1.5 text-sm text-ink-muted">solgte varer</span>
            </div>
            <div className="w-px h-5 bg-cream-dark" />
            <div>
              <span className="text-xl font-bold font-display text-forest">{club.rating} ⭐</span>
              <span className="ml-1.5 text-sm text-ink-muted">snittkarakter</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Interactive listings with search, filter, sort */}
        <ClubListings clubId={club.id} clubName={club.name} initialListings={listings} />

        {/* Byttemarked banner */}
        <div className="mt-12 rounded-2xl bg-amber p-8 sm:p-10 text-center grain-overlay">
          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white">
            {club.name} Digitalt Byttemarked
          </h3>
          <p className="mt-1 text-lg text-white/90 font-display">18. oktober 2025</p>
          <p className="mt-3 text-white/80 text-sm max-w-lg mx-auto">
            Alle varer fra klubbens medlemmer • Legg ut din annonse nå og nå
            hundrevis av klubbmedlemmer.
          </p>
          <Link
            href="/selg"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-amber hover:bg-cream transition-colors"
          >
            Legg ut annonse
          </Link>
        </div>

        {/* Active sellers */}
        <div className="mt-12">
          <h3 className="font-display text-xl font-semibold text-ink mb-6">
            Aktive selgere i {club.name}
          </h3>
          <div className="flex flex-wrap gap-6">
            {sellers.map((seller) => (
              <Link
                key={seller.id}
                href={`/profil/${seller.slug}`}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="h-14 w-14 rounded-full bg-forest/10 flex items-center justify-center text-forest font-bold text-sm group-hover:bg-forest/20 transition-colors">
                  {seller.avatar}
                </div>
                <span className="text-sm font-medium text-ink group-hover:text-forest transition-colors">{seller.name}</span>
                <span className="text-xs text-ink-muted">{seller.total_sold} solgt</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Club admin CTA */}
        <div className="mt-12 rounded-xl bg-white border border-cream-dark p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-display text-lg font-semibold text-ink">
              Er du lagleder?
            </h4>
            <p className="text-sm text-ink-muted mt-1">
              Administrer klubbsiden, inviter medlemmer og se statistikk.
            </p>
          </div>
          <Link
            href={`/klubb/${slug}/admin`}
            className="text-sm font-semibold text-forest hover:text-forest-light transition-colors whitespace-nowrap"
          >
            Administrer klubbsiden →
          </Link>
        </div>
      </div>
    </>
  );
}
