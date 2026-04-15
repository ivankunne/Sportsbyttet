import Link from "next/link";
import {
  getAllClubs,
  getClubBySlug,
  getListingsByClub,
  getProfilesByClub,
} from "@/lib/queries";

export const revalidate = 60;

export async function generateStaticParams() {
  const clubs = await getAllClubs();
  return clubs.map((club) => ({ slug: club.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ClubAdminPage({ params }: Props) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);

  if (!club) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Klubb ikke funnet</h1>
      </div>
    );
  }

  const [listings, sellers] = await Promise.all([
    getListingsByClub(club.id),
    getProfilesByClub(club.id),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-bold"
            style={{ backgroundColor: club.color }}
          >
            {club.initials}
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">{club.name}</h1>
            <p className="text-sm text-ink-muted">Administrasjonspanel</p>
          </div>
        </div>
        <Link href={`/klubb/${club.slug}`} className="text-sm font-medium text-forest hover:text-forest-light transition-colors">
          ← Tilbake til klubbsiden
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Aktive annonser", value: club.active_listings.toString(), change: "+3 denne uken" },
          { label: "Totalt solgt", value: club.total_sold.toString(), change: "+12 denne måneden" },
          { label: "Medlemmer", value: club.members.toLocaleString("nb-NO"), change: "+5 denne uken" },
          { label: "Snittkarakter", value: `${club.rating} ⭐`, change: "Stabil" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-xs text-ink-muted font-medium uppercase tracking-wider">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold font-display text-ink">{stat.value}</p>
            <p className="mt-1 text-xs text-emerald-600">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-cream flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">Siste annonser</h2>
              <span className="text-xs text-ink-muted">{listings.length} annonser</span>
            </div>
            <div className="divide-y divide-cream">
              {listings.slice(0, 6).map((listing) => (
                <div key={listing.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-cream flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{listing.title}</p>
                    <p className="text-xs text-ink-muted">{listing.profiles.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-forest">{listing.price.toLocaleString("nb-NO")} kr</p>
                    <p className="text-xs text-ink-muted">{listing.views} visninger</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-display text-lg font-semibold text-ink mb-4">Aktive selgere</h2>
            <div className="space-y-3">
              {sellers.map((seller) => (
                <div key={seller.id} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-forest/10 flex items-center justify-center text-forest text-xs font-bold">
                    {seller.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{seller.name}</p>
                    <p className="text-xs text-ink-muted">{seller.total_sold} solgt</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-display text-lg font-semibold text-ink mb-4">Hurtighandlinger</h2>
            <div className="space-y-2">
              {[
                { label: "Inviter medlemmer", icon: "+" },
                { label: "Opprett byttemarked", icon: "📅" },
                { label: "Rediger klubbinfo", icon: "✏️" },
                { label: "Se fullstendig statistikk", icon: "📊" },
                { label: "Eksporter medlemsliste", icon: "📥" },
              ].map((action) => (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-ink-light hover:bg-cream hover:text-ink transition-colors text-left"
                >
                  <span>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-amber/10 rounded-xl p-6 border border-amber/20">
            <h3 className="font-display text-base font-semibold text-ink">Oppgrader til Pro</h3>
            <p className="mt-1 text-sm text-ink-light">
              Få avansert statistikk, flere admin-brukere og lavere transaksjonsgebyr.
            </p>
            <Link href="/priser" className="mt-3 inline-block text-sm font-semibold text-amber hover:text-amber-dark transition-colors">
              Se planer →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
