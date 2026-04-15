"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type {
  ListingWithRelations,
  Club,
  ProfileWithClub,
} from "@/lib/queries";

type QuickResult = {
  type: "listing" | "club" | "profile";
  id: number;
  title: string;
  subtitle: string;
  href: string;
  avatar?: string;
  color?: string;
  price?: number;
};

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QuickResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setResults([]);
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Keyboard shortcut: Cmd/Ctrl+K to focus
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const quickSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const pattern = `%${q.trim()}%`;

    const [listingsRes, clubsRes, profilesRes] = await Promise.all([
      supabase
        .from("listings")
        .select("*, clubs(*), profiles(*)")
        .eq("is_sold", false)
        .or(`title.ilike.${pattern},category.ilike.${pattern}`)
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("clubs")
        .select("*")
        .ilike("name", pattern)
        .limit(3),
      supabase
        .from("profiles")
        .select("*, clubs(*)")
        .or(`name.ilike.${pattern},bio.ilike.${pattern}`)
        .limit(3),
    ]);

    const items: QuickResult[] = [];

    for (const c of (clubsRes.data ?? []) as Club[]) {
      items.push({
        type: "club",
        id: c.id,
        title: c.name,
        subtitle: `${c.members.toLocaleString("nb-NO")} medlemmer • ${c.active_listings} annonser`,
        href: `/klubb/${c.slug}`,
        avatar: c.initials,
        color: c.color,
      });
    }

    for (const p of (profilesRes.data ?? []) as ProfileWithClub[]) {
      items.push({
        type: "profile",
        id: p.id,
        title: p.name,
        subtitle: `${p.clubs?.name ?? "Ingen klubb"} • ${p.total_sold} solgt`,
        href: `/profil/${p.slug}`,
        avatar: p.avatar,
      });
    }

    for (const l of (listingsRes.data ?? []) as ListingWithRelations[]) {
      items.push({
        type: "listing",
        id: l.id,
        title: l.title,
        subtitle: `${l.price.toLocaleString("nb-NO")} kr • ${l.clubs.name}`,
        href: `/annonse/${l.id}`,
        price: l.price,
      });
    }

    setResults(items);
    setSelectedIdx(-1);
    setLoading(false);
  }, []);

  // Debounced search
  useEffect(() => {
    const id = setTimeout(() => quickSearch(query), 200);
    return () => clearTimeout(id);
  }, [query, quickSearch]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIdx >= 0 && results[selectedIdx]) {
        router.push(results[selectedIdx].href);
        setQuery("");
        setResults([]);
        setSearchOpen(false);
      } else {
        router.push(`/sok?q=${encodeURIComponent(query)}`);
        setResults([]);
        setSearchOpen(false);
      }
    } else if (e.key === "Escape") {
      setResults([]);
      setSearchOpen(false);
      inputRef.current?.blur();
    }
  }

  function goToFullSearch() {
    router.push(`/sok?q=${encodeURIComponent(query)}`);
    setQuery("");
    setResults([]);
    setSearchOpen(false);
  }

  const typeBadge: Record<string, { label: string; bg: string; text: string }> = {
    club: { label: "Klubb", bg: "bg-blue-50", text: "text-blue-700" },
    profile: { label: "Person", bg: "bg-violet-50", text: "text-violet-700" },
    listing: { label: "Utstyr", bg: "bg-amber-50", text: "text-amber-700" },
  };

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-cream-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-1 flex-shrink-0">
            <span className="font-display text-2xl font-semibold text-forest">
              <span className="text-3xl">S</span>portsbyttet
            </span>
          </Link>

          {/* Desktop search */}
          <div className="hidden md:block flex-1 max-w-md mx-4" ref={dropdownRef}>
            <div className="relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Søk utstyr, klubber, personer..."
                className="w-full rounded-full border border-cream-dark bg-white pl-10 pr-16 py-2 text-sm placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-0.5 rounded border border-cream-dark bg-cream px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
                ⌘K
              </kbd>

              {/* Quick results dropdown */}
              {searchOpen && query.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-cream-dark overflow-hidden z-50">
                  {loading && (
                    <div className="flex items-center justify-center py-6">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-forest border-r-transparent" />
                    </div>
                  )}

                  {!loading && results.length === 0 && (
                    <div className="px-4 py-6 text-center text-sm text-ink-muted">
                      Ingen resultater for &ldquo;{query}&rdquo;
                    </div>
                  )}

                  {!loading && results.length > 0 && (
                    <div className="py-2">
                      {results.map((r, i) => (
                        <Link
                          key={`${r.type}-${r.id}`}
                          href={r.href}
                          onClick={() => {
                            setQuery("");
                            setResults([]);
                            setSearchOpen(false);
                          }}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            selectedIdx === i
                              ? "bg-forest/5"
                              : "hover:bg-cream"
                          }`}
                        >
                          {r.type === "club" && (
                            <div
                              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white text-[10px] font-bold"
                              style={{ backgroundColor: r.color }}
                            >
                              {r.avatar}
                            </div>
                          )}
                          {r.type === "profile" && (
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest text-[10px] font-bold">
                              {r.avatar}
                            </div>
                          )}
                          {r.type === "listing" && (
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber/10 text-amber">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                              </svg>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-ink truncate">
                              {r.title}
                            </p>
                            <p className="text-xs text-ink-muted truncate">
                              {r.subtitle}
                            </p>
                          </div>
                          <span className={`text-[10px] font-semibold uppercase tracking-wider flex-shrink-0 rounded-full px-2 py-0.5 ${typeBadge[r.type].bg} ${typeBadge[r.type].text}`}>
                            {typeBadge[r.type].label}
                          </span>
                        </Link>
                      ))}

                      <div className="border-t border-cream mt-1 pt-1">
                        <button
                          onClick={goToFullSearch}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-forest font-medium hover:bg-cream transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                          </svg>
                          Vis alle resultater for &ldquo;{query}&rdquo;
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 flex-shrink-0">
            <Link
              href="/utforsk"
              className="text-sm font-medium text-ink-light hover:text-forest transition-colors"
            >
              Utforsk
            </Link>
            <Link
              href="/klubber"
              className="text-sm font-medium text-ink-light hover:text-forest transition-colors"
            >
              Klubber
            </Link>
            <Link
              href="/selg"
              className="text-sm font-medium text-ink-light hover:text-forest transition-colors"
            >
              Selg
            </Link>
            <Link
              href="/registrer-klubb"
              className="rounded-full bg-amber px-5 py-2 text-sm font-semibold text-white hover:bg-amber-dark transition-colors"
            >
              Registrer klubb
            </Link>
          </nav>

          {/* Mobile: search + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                setMenuOpen(false);
              }}
              className="p-2 text-ink"
              aria-label="Søk"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
            <button
              className="p-2 text-ink"
              onClick={() => {
                setMenuOpen(!menuOpen);
                setSearchOpen(false);
              }}
              aria-label="Åpne meny"
            >
              {menuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="md:hidden border-t border-cream-dark bg-cream px-4 py-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) {
                router.push(`/sok?q=${encodeURIComponent(query.trim())}`);
                setSearchOpen(false);
                setQuery("");
              }
            }}
          >
            <div className="relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Søk utstyr, klubber, personer..."
                autoFocus
                className="w-full rounded-full border border-cream-dark bg-white pl-10 pr-4 py-2.5 text-sm placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-forest/20"
              />
            </div>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-cream-dark bg-cream">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/utforsk"
              className="block text-sm font-medium text-ink-light hover:text-forest"
              onClick={() => setMenuOpen(false)}
            >
              Utforsk utstyr
            </Link>
            <Link
              href="/klubber"
              className="block text-sm font-medium text-ink-light hover:text-forest"
              onClick={() => setMenuOpen(false)}
            >
              Klubber
            </Link>
            <Link
              href="/selg"
              className="block text-sm font-medium text-ink-light hover:text-forest"
              onClick={() => setMenuOpen(false)}
            >
              Selg utstyr
            </Link>
            <Link
              href="/registrer-klubb"
              className="block w-full text-center rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-white"
              onClick={() => setMenuOpen(false)}
            >
              Registrer din klubb
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
