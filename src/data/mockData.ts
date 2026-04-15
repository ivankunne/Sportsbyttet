// TODO: Replace this entire file with Supabase queries when going live
// Each export below maps to a Supabase table or view.

export type Listing = {
  id: number;
  title: string;
  price: number;
  condition: "Som ny" | "Pent brukt" | "Godt brukt" | "Mye brukt";
  category: string;
  club: string;
  clubSlug: string;
  seller: string;
  sellerRating: number;
  sellerListings: number;
  sellerMemberSince: string;
  daysAgo: number;
  views: number;
  image: string;
  images?: string[];
  description?: string;
  specs?: Record<string, string>;
};

export type Club = {
  id: number;
  name: string;
  slug: string;
  initials: string;
  members: number;
  activeListings: number;
  totalSold: number;
  rating: number;
  color: string;
};

export type Category = {
  name: string;
  slug: string;
  emoji: string;
};

export const categories: Category[] = [
  { name: "Alpint & Topptur", slug: "alpint", emoji: "⛷️" },
  { name: "Klatring", slug: "klatring", emoji: "🧗" },
  { name: "Sykkel", slug: "sykkel", emoji: "🚴" },
  { name: "Løping & Ski", slug: "loping-ski", emoji: "🏃" },
  { name: "Friluftsliv", slug: "friluftsliv", emoji: "🏕️" },
  { name: "Treningsklær", slug: "treningsklaer", emoji: "👕" },
];

export const mockClubs: Club[] = [
  {
    id: 1,
    name: "Bergen Skiklubb",
    slug: "bergen-sk",
    initials: "BSK",
    members: 847,
    activeListings: 23,
    totalSold: 156,
    rating: 4.8,
    color: "#1a3c2e",
  },
  {
    id: 2,
    name: "Åsane Klatreklubb",
    slug: "asane-klatreklubb",
    initials: "ÅK",
    members: 312,
    activeListings: 14,
    totalSold: 89,
    rating: 4.6,
    color: "#5c3d1e",
  },
  {
    id: 3,
    name: "Bergen Sykkelklubb",
    slug: "bergen-sykkelklubb",
    initials: "BSY",
    members: 523,
    activeListings: 19,
    totalSold: 201,
    rating: 4.7,
    color: "#1e3a5c",
  },
  {
    id: 4,
    name: "Arna-Bjørnar",
    slug: "arna-bjornar",
    initials: "AB",
    members: 1204,
    activeListings: 31,
    totalSold: 340,
    rating: 4.5,
    color: "#5c1e2e",
  },
  {
    id: 5,
    name: "Brann Sportsklubb Friluftsliv",
    slug: "brann-friluftsliv",
    initials: "BF",
    members: 678,
    activeListings: 11,
    totalSold: 78,
    rating: 4.9,
    color: "#8B0000",
  },
];

// TODO: Replace with Supabase query - fetch listings, join with clubs table
export const mockListings: Listing[] = [
  {
    id: 1,
    title: "Salomon QST 106 ski med bindinger — 180cm",
    price: 4200,
    condition: "Pent brukt",
    category: "Alpint",
    club: "Bergen Skiklubb",
    clubSlug: "bergen-sk",
    seller: "Markus H.",
    sellerRating: 4.9,
    sellerListings: 5,
    sellerMemberSince: "2021",
    daysAgo: 3,
    views: 47,
    image: "https://picsum.photos/seed/ski1/400/300",
    images: [
      "https://picsum.photos/seed/ski1/800/600",
      "https://picsum.photos/seed/ski1b/800/600",
      "https://picsum.photos/seed/ski1c/800/500",
      "https://picsum.photos/seed/ski1d/600/800",
    ],
    description:
      "Selger Salomon QST 106 i 180cm. Kjøpt nye i 2022, brukt 15-20 dager. Veldig bra allround-ski for både løyper og litt offpist. Bindinger (Salomon Warden MNC 13) inkludert og nylig justert av XXL. Kan leveres i Bergen eller sendes med Bring.",
    specs: {
      Lengde: "180 cm",
      Bredde: "106mm (waist)",
      Binding: "Salomon Warden MNC 13",
      Skostørrelse: "26.5–30.5",
      "Sesonger brukt": "3",
    },
  },
  {
    id: 2,
    title: "Black Diamond Momentum klatresele",
    price: 450,
    condition: "Godt brukt",
    category: "Klatring",
    club: "Åsane Klatreklubb",
    clubSlug: "asane-klatreklubb",
    seller: "Ingrid S.",
    sellerRating: 4.7,
    sellerListings: 3,
    sellerMemberSince: "2022",
    daysAgo: 1,
    views: 22,
    image: "https://picsum.photos/seed/climb1/400/300",
  },
  {
    id: 3,
    title: "Specialized Rockhopper Sport 29\" — M",
    price: 8500,
    condition: "Pent brukt",
    category: "Sykkel",
    club: "Bergen Sykkelklubb",
    clubSlug: "bergen-sykkelklubb",
    seller: "Erik M.",
    sellerRating: 5.0,
    sellerListings: 2,
    sellerMemberSince: "2020",
    daysAgo: 5,
    views: 89,
    image: "https://picsum.photos/seed/bike1/400/300",
  },
  {
    id: 4,
    title: "Hoka Speedgoat 5 løpesko — str 43",
    price: 850,
    condition: "Godt brukt",
    category: "Løping & Ski",
    club: "Bergen Skiklubb",
    clubSlug: "bergen-sk",
    seller: "Kari N.",
    sellerRating: 4.8,
    sellerListings: 7,
    sellerMemberSince: "2019",
    daysAgo: 2,
    views: 34,
    image: "https://picsum.photos/seed/run1/400/300",
  },
  {
    id: 5,
    title: "Hilleberg Anjan 2 telt",
    price: 5800,
    condition: "Som ny",
    category: "Friluftsliv",
    club: "Brann Sportsklubb Friluftsliv",
    clubSlug: "brann-friluftsliv",
    seller: "Jonas K.",
    sellerRating: 4.6,
    sellerListings: 1,
    sellerMemberSince: "2023",
    daysAgo: 7,
    views: 61,
    image: "https://picsum.photos/seed/tent1/400/300",
  },
  {
    id: 6,
    title: "Norrøna Falketind Gore-Tex jakke — L",
    price: 2400,
    condition: "Pent brukt",
    category: "Treningsklær",
    club: "Bergen Skiklubb",
    clubSlug: "bergen-sk",
    seller: "Thomas A.",
    sellerRating: 4.5,
    sellerListings: 4,
    sellerMemberSince: "2020",
    daysAgo: 4,
    views: 53,
    image: "https://picsum.photos/seed/jacket1/400/300",
  },
  {
    id: 7,
    title: "Rossignol telemark ski — 170cm",
    price: 1900,
    condition: "Godt brukt",
    category: "Alpint",
    club: "Bergen Skiklubb",
    clubSlug: "bergen-sk",
    seller: "Lars P.",
    sellerRating: 4.3,
    sellerListings: 6,
    sellerMemberSince: "2018",
    daysAgo: 6,
    views: 28,
    image: "https://picsum.photos/seed/tele1/400/300",
  },
  {
    id: 8,
    title: "Osprey Atmos AG 65L ryggsekk",
    price: 1600,
    condition: "Pent brukt",
    category: "Friluftsliv",
    club: "Arna-Bjørnar",
    clubSlug: "arna-bjornar",
    seller: "Silje R.",
    sellerRating: 4.9,
    sellerListings: 2,
    sellerMemberSince: "2021",
    daysAgo: 1,
    views: 41,
    image: "https://picsum.photos/seed/pack1/400/300",
  },
  {
    id: 9,
    title: "Burton Custom snowboard — 158cm",
    price: 3200,
    condition: "Pent brukt",
    category: "Alpint",
    club: "Bergen Skiklubb",
    clubSlug: "bergen-sk",
    seller: "Anders V.",
    sellerRating: 4.7,
    sellerListings: 3,
    sellerMemberSince: "2022",
    daysAgo: 8,
    views: 37,
    image: "https://picsum.photos/seed/snow1/400/300",
  },
  {
    id: 10,
    title: "Leki Carbon skistaver — 125cm",
    price: 650,
    condition: "Som ny",
    category: "Alpint",
    club: "Bergen Skiklubb",
    clubSlug: "bergen-sk",
    seller: "Markus H.",
    sellerRating: 4.9,
    sellerListings: 5,
    sellerMemberSince: "2021",
    daysAgo: 2,
    views: 19,
    image: "https://picsum.photos/seed/poles1/400/300",
  },
  {
    id: 11,
    title: "Smith Vantage MIPS skihjelm — M",
    price: 1100,
    condition: "Pent brukt",
    category: "Alpint",
    club: "Bergen Skiklubb",
    clubSlug: "bergen-sk",
    seller: "Kari N.",
    sellerRating: 4.8,
    sellerListings: 7,
    sellerMemberSince: "2019",
    daysAgo: 10,
    views: 33,
    image: "https://picsum.photos/seed/helm1/400/300",
  },
  {
    id: 12,
    title: "Arc'teryx Beta AR jakke — M",
    price: 3800,
    condition: "Som ny",
    category: "Treningsklær",
    club: "Brann Sportsklubb Friluftsliv",
    clubSlug: "brann-friluftsliv",
    seller: "Maja L.",
    sellerRating: 5.0,
    sellerListings: 1,
    sellerMemberSince: "2024",
    daysAgo: 0,
    views: 12,
    image: "https://picsum.photos/seed/arc1/400/300",
  },
];

export const clubFilterCategories = [
  "Alle",
  "Alpint",
  "Topptur",
  "Langrenn",
  "Klær",
];

export type Seller = {
  name: string;
  slug: string;
  listings: number;
  avatar: string;
  rating: number;
  memberSince: string;
  club: string;
  clubSlug: string;
  bio: string;
  totalSold: number;
};

export const mockSellers: Seller[] = [
  { name: "Markus H.", slug: "markus-h", listings: 5, avatar: "MH", rating: 4.9, memberSince: "2021", club: "Bergen Skiklubb", clubSlug: "bergen-sk", bio: "Ivrig alpinist og toppturentusiast. Oppgraderer utstyr ofte — selger det som ikke lenger er i bruk.", totalSold: 12 },
  { name: "Kari N.", slug: "kari-n", listings: 7, avatar: "KN", rating: 4.8, memberSince: "2019", club: "Bergen Skiklubb", clubSlug: "bergen-sk", bio: "Allsidig idrettsutøver. Løping, ski og fjellvandring. Rydder i boden!", totalSold: 18 },
  { name: "Thomas A.", slug: "thomas-a", listings: 4, avatar: "TA", rating: 4.5, memberSince: "2020", club: "Bergen Skiklubb", clubSlug: "bergen-sk", bio: "Friluftsmenneske fra Bergen. Selger utstyr barna har vokst ut av.", totalSold: 9 },
  { name: "Lars P.", slug: "lars-p", listings: 6, avatar: "LP", rating: 4.3, memberSince: "2018", club: "Bergen Skiklubb", clubSlug: "bergen-sk", bio: "Telemark-entusiast og utstyrsnerden. Alltid på jakt etter neste ski.", totalSold: 22 },
  { name: "Anders V.", slug: "anders-v", listings: 3, avatar: "AV", rating: 4.7, memberSince: "2022", club: "Bergen Skiklubb", clubSlug: "bergen-sk", bio: "Snowboard og alpint. Bytter utstyr hvert år.", totalSold: 6 },
  { name: "Ingrid S.", slug: "ingrid-s", listings: 3, avatar: "IS", rating: 4.7, memberSince: "2022", club: "Åsane Klatreklubb", clubSlug: "asane-klatreklubb", bio: "Klatreentusiast med base i Bergen. Inneklatring og sportsklatring.", totalSold: 5 },
  { name: "Erik M.", slug: "erik-m", listings: 2, avatar: "EM", rating: 5.0, memberSince: "2020", club: "Bergen Sykkelklubb", clubSlug: "bergen-sykkelklubb", bio: "Sykkelmekaniker på hobbybasis. Alt utstyr er gjennomgått før salg.", totalSold: 8 },
  { name: "Jonas K.", slug: "jonas-k", listings: 1, avatar: "JK", rating: 4.6, memberSince: "2023", club: "Brann Sportsklubb Friluftsliv", clubSlug: "brann-friluftsliv", bio: "Ny i Bergen, solgte alt i Oslo og starter på nytt.", totalSold: 3 },
  { name: "Silje R.", slug: "silje-r", listings: 2, avatar: "SR", rating: 4.9, memberSince: "2021", club: "Arna-Bjørnar", clubSlug: "arna-bjornar", bio: "Turjente og friluftsliv-nerd. Selger utstyr i topp stand.", totalSold: 7 },
  { name: "Maja L.", slug: "maja-l", listings: 1, avatar: "ML", rating: 5.0, memberSince: "2024", club: "Brann Sportsklubb Friluftsliv", clubSlug: "brann-friluftsliv", bio: "Ny på plattformen! Selger utstyr jeg fikk i gave men aldri brukte.", totalSold: 1 },
];
