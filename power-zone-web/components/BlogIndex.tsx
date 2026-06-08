'use client';

/* -----------------------------------------------------------------------------
 * BlogIndex — editorial-but-structured index for /blog.
 *
 * Layout:
 *   - Hero with eyebrow + italic-accented display title
 *   - Search + filter inside a proper bordered card (not a floating rail)
 *   - Featured article = large, image-area-substituted color block on
 *     the left, body content on the right, all inside ONE bordered card
 *   - Rest of the catalog as a card grid (3-up lg, 2-up md, 1-up sm),
 *     with article numbering + italic title accents + visible borders so
 *     each card has hand-set magazine character but the grid still
 *     reads as a clear structured layout
 * -------------------------------------------------------------------------- */

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { POSTS } from '@/data/blog';
import type { BlogCategory, BlogPost } from '@/data/blog';
import Navbar from '@/components/Navbar';

type Filter = 'All' | BlogCategory;
const FILTERS: Filter[] = ['All', 'Hybrid Inverters', 'Diesel Generators'];

function matches(post: BlogPost, query: string, filter: Filter): boolean {
  if (filter !== 'All' && post.category !== filter) return false;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [post.title, post.excerpt, post.category, ...post.tags]
    .join(' ')
    .toLowerCase();
  return q
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
}

export default function BlogIndex() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  const filtered = useMemo(
    () => POSTS.filter((p) => matches(p, query, filter)),
    [query, filter],
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F4EFE7] text-black">
      <div className="absolute left-0 right-0 top-0 z-30">
        <Navbar />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pb-28 pt-28 md:px-10 md:pt-36 lg:px-14">
        {/* ── HERO ────────────────────────────────────────────────────── */}
        <section className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end md:gap-16">
          <div>
            <div className="flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-red-600" />
              <p className="font-tiny text-[11px] font-medium uppercase tracking-[0.32em] text-red-600">
                The Journal · Issue {String(POSTS.length).padStart(2, '0')}
              </p>
            </div>
            <h1
              className="
                font-heading mt-6
                text-[clamp(40px,6.5vw,76px)] font-semibold
                leading-[1.0] tracking-tight text-black
              "
              style={{ letterSpacing: '-0.02em' }}
            >
              Notes from
              <br />
              the{' '}
              <span className="font-heading italic font-normal text-black/75">
                power room.
              </span>
            </h1>
          </div>
          <p className="font-body max-w-[28rem] text-[14px] leading-relaxed text-black/60 md:text-[15px]">
            Field-tested writing on diesel generators, hybrid inverters,
            and the energy systems we install across Pakistan — by the
            engineers who run them.
          </p>
        </section>

        {/* ── SEARCH + FILTER CARD ───────────────────────────────────── */}
        <section className="mt-12 md:mt-16">
          <div
            className="
              rounded-2xl border border-black/10 bg-white
              shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04),0_18px_48px_-18px_rgba(0,0,0,0.08)]
              p-4 md:p-5
            "
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
              <SearchBar value={query} onChange={setQuery} />
              <div className="flex shrink-0 flex-wrap items-center gap-1.5 md:border-l md:border-black/10 md:pl-5">
                {FILTERS.map((f) => {
                  const active = filter === f;
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilter(f)}
                      className={`
                        font-tiny cursor-pointer rounded-full px-3.5 py-1.5
                        text-[10.5px] font-semibold uppercase tracking-[0.22em]
                        transition-colors duration-200
                        ${
                          active
                            ? 'bg-black text-white'
                            : 'border border-black/15 text-black/60 hover:border-black/35 hover:text-black'
                        }
                      `}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <p className="font-tiny mt-4 px-1 text-[10.5px] uppercase tracking-[0.24em] text-black/45">
            {String(filtered.length).padStart(2, '0')}{' '}
            {filtered.length === 1 ? 'article' : 'articles'}
            {query ? (
              <>
                {' '}— matching <span className="text-black/70">&ldquo;{query}&rdquo;</span>
              </>
            ) : null}
          </p>
        </section>

        {/* ── RESULTS ─────────────────────────────────────────────────── */}
        <section className="mt-10 md:mt-12">
          {filtered.length === 0 ? (
            <EmptyState
              query={query}
              onClear={() => {
                setQuery('');
                setFilter('All');
              }}
            />
          ) : (
            <>
              {featured ? <FeaturedCard post={featured} /> : null}
              {rest.length > 0 ? (
                <div className="mt-12 md:mt-14">
                  <div className="mb-6 flex items-center gap-4">
                    <span aria-hidden className="h-px w-10 bg-red-600" />
                    <p className="font-tiny text-[10.5px] font-semibold uppercase tracking-[0.32em] text-red-600">
                      More Articles
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    {rest.map((post, i) => (
                      <PostCard key={post.slug} post={post} index={i + 1} />
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

/* ── SearchBar ──────────────────────────────────────────────────────── */
function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="group flex flex-1 items-center gap-3 px-1">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0 text-black/35 transition-colors group-focus-within:text-red-600"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder="Search the journal…"
        className="
          font-body flex-1 bg-transparent text-[14px] text-black
          placeholder:text-black/35
          focus:outline-none md:text-[15px]
        "
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="shrink-0 rounded-full p-1 text-black/40 transition-colors hover:bg-black/10 hover:text-black"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            className="h-3.5 w-3.5"
            aria-hidden
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      ) : null}
    </label>
  );
}

/* ── FeaturedCard ────────────────────────────────────────────────────
 * Substantial bordered card. Two-column layout on md+:
 *   left  → category-tinted color plate with FEATURED label + huge
 *           italic article index numeral (substitute for the missing
 *           hero image — gives the card real visual weight)
 *   right → category accent + title + excerpt + read affordance
 * On mobile the plate is a slim top strip so the body content still
 * leads. */
function FeaturedCard({ post }: { post: BlogPost }) {
  const plateBg =
    post.category === 'Hybrid Inverters'
      ? 'bg-gradient-to-br from-red-50 via-red-100/40 to-red-200/30'
      : 'bg-gradient-to-br from-amber-50 via-amber-100/45 to-amber-200/30';
  const plateAccent =
    post.category === 'Hybrid Inverters' ? 'text-red-600' : 'text-amber-700';

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="
        group relative grid overflow-hidden
        rounded-[1.75rem] border border-black/10 bg-white
        shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05),0_30px_70px_-30px_rgba(0,0,0,0.18)]
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08),0_38px_80px_-25px_rgba(0,0,0,0.22)]
        grid-rows-[auto_1fr]
        md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:grid-rows-1
      "
    >
      {/* Color plate / hero substitute */}
      <div className={`relative overflow-hidden p-8 md:p-10 ${plateBg}`}>
        <div className="flex items-center gap-3">
          <span aria-hidden className={`h-px w-8 bg-current ${plateAccent}`} />
          <span
            className={`font-tiny text-[10.5px] font-semibold uppercase tracking-[0.32em] ${plateAccent}`}
          >
            Featured Read
          </span>
        </div>
        <span
          className="font-heading mt-6 block italic leading-[0.85] text-black/85 text-[clamp(96px,16vw,200px)]"
          style={{ letterSpacing: '-0.04em' }}
          aria-hidden
        >
          01
        </span>
        <span className="font-tiny mt-4 inline-block text-[11px] uppercase tracking-[0.28em] text-black/55">
          {post.readMinutes} min read
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col justify-between p-8 md:p-10">
        <div>
          <CategoryTag category={post.category} />
          <h2
            className="
              font-heading mt-5
              text-[clamp(26px,3.4vw,42px)] font-semibold
              leading-[1.06] tracking-tight text-black
              transition-colors group-hover:text-red-700
            "
            style={{ letterSpacing: '-0.015em' }}
          >
            {post.title}
          </h2>
          <p className="font-body mt-5 text-[15px] leading-[1.7] text-black/65 md:text-[16px]">
            {post.excerpt}
          </p>
        </div>
        <ReadAffordance className="mt-8" />
      </div>
    </Link>
  );
}

/* ── PostCard ────────────────────────────────────────────────────────
 * Bordered card with hand-set editorial details:
 *   - small italic article index in the top-right corner
 *   - category accent rule + label
 *   - title + 3-line excerpt
 *   - read affordance pinned to the card foot
 * Lifts + tints title on hover. */
function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="
        group relative flex h-full flex-col
        overflow-hidden rounded-2xl
        border border-black/10 bg-white
        shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04),0_18px_48px_-22px_rgba(0,0,0,0.12)]
        p-7
        transition-all duration-300
        hover:-translate-y-1 hover:border-black/25
        hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08),0_24px_60px_-22px_rgba(0,0,0,0.20)]
      "
    >
      {/* Top row: category + index numeral */}
      <div className="flex items-start justify-between gap-4">
        <CategoryTag category={post.category} />
        <span
          className="font-heading italic leading-none text-black/15 text-[28px] tabular-nums"
          style={{ letterSpacing: '-0.01em' }}
          aria-hidden
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h3
        className="
          font-heading mt-5
          text-[18px] font-semibold leading-[1.22]
          tracking-tight text-black
          transition-colors group-hover:text-red-700
          md:text-[19px]
        "
        style={{ letterSpacing: '-0.005em' }}
      >
        {post.title}
      </h3>

      <p className="font-body mt-3 line-clamp-3 text-[13.5px] leading-relaxed text-black/60">
        {post.excerpt}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4">
        <span className="font-tiny text-[10px] font-semibold uppercase tracking-[0.22em] text-black/40">
          {post.readMinutes} min read
        </span>
        <ReadAffordance />
      </div>
    </Link>
  );
}

/* ── ReadAffordance ────────────────────────────────────────────────── */
function ReadAffordance({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-tiny inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-black/75 group-hover:text-red-600 ${className}`.trim()}
    >
      Read
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
        aria-hidden
      >
        <path d="M3 8h10" />
        <path d="M9 4l4 4-4 4" />
      </svg>
    </span>
  );
}

/* ── CategoryTag ───────────────────────────────────────────────────── */
function CategoryTag({ category }: { category: BlogCategory }) {
  const accent =
    category === 'Hybrid Inverters' ? 'text-red-600' : 'text-amber-700';
  return (
    <span
      className={`font-tiny inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.28em] ${accent}`}
    >
      <span aria-hidden className="mr-2 inline-block h-px w-5 bg-current opacity-55" />
      {category}
    </span>
  );
}

/* ── EmptyState ────────────────────────────────────────────────────── */
function EmptyState({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <div
      className="
        mx-auto flex max-w-[520px] flex-col items-center
        rounded-2xl border border-black/10 bg-white
        shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04),0_18px_48px_-22px_rgba(0,0,0,0.10)]
        px-8 py-14 text-center
      "
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-black/[0.04]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          className="h-5 w-5 text-black/50"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </div>
      <h3
        className="font-heading mt-5 text-[20px] font-semibold tracking-tight text-black"
        style={{ letterSpacing: '-0.005em' }}
      >
        Nothing matched{query ? ` "${query}"` : ' your filter'}.
      </h3>
      <p className="font-body mt-2 text-[13.5px] leading-relaxed text-black/55">
        Try a different keyword or clear the filters to see every article.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="
          font-tiny mt-6 inline-flex cursor-pointer items-center gap-2
          rounded-full bg-black px-5 py-2
          text-[11px] font-semibold uppercase tracking-[0.22em] text-white
          transition-colors hover:bg-red-600
        "
      >
        Reset
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3 w-3"
          aria-hidden
        >
          <path d="M3 8h10" />
          <path d="M9 4l4 4-4 4" />
        </svg>
      </button>
    </div>
  );
}
