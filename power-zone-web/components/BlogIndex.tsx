'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { POSTS } from '@/data/blog';
import type { BlogCategory, BlogPost } from '@/data/blog';
import Navbar from '@/components/Navbar';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

type Filter = 'All' | BlogCategory;
const FILTERS: Filter[] = ['All', 'Hybrid Inverters', 'Diesel Generators'];

function matches(post: BlogPost, query: string, filter: Filter): boolean {
  if (filter !== 'All' && post.category !== filter) return false;
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    post.title,
    post.excerpt,
    post.category,
    ...post.tags,
  ]
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

      <main
        className="
          relative z-10 mx-auto w-full max-w-[1400px]
          px-6 pb-24 pt-24 md:px-10 md:pt-32 lg:px-16
        "
      >
        {/* Hero */}
        <section className="text-center">
          <p className="font-tiny text-[11px] font-medium uppercase tracking-[0.32em] text-red-500">
            Insights &amp; Field Notes
          </p>
          <h1
            className="
              font-heading
              mx-auto mt-4 max-w-[60rem]
              text-[clamp(34px,4.4vw,60px)] font-semibold
              leading-[1.04] tracking-tight text-black
            "
            style={{ letterSpacing: '-0.01em' }}
          >
            Knowledge from the
            {/* font-serif removed — italic kept as a style modifier, family
                switched to Sansation (font-heading) per the three-font rule. */}
            <span className="font-heading ml-3 italic font-normal text-black/70">
              power room.
            </span>
          </h1>
          <p className="font-body mx-auto mt-5 max-w-[44rem] text-[14px] leading-relaxed text-black/60 md:text-[15px]">
            Practical guides on diesel generators, hybrid inverters, and the
            energy systems we install across Pakistan — written by the people
            who run them.
          </p>
        </section>

        {/* Search + filters */}
        <section className="mt-12 md:mt-14">
          <div className="mx-auto flex max-w-[760px] flex-col items-stretch gap-4">
            <SearchBar value={query} onChange={setQuery} />
            <div className="flex flex-wrap items-center justify-center gap-2">
              {FILTERS.map((f) => {
                const active = filter === f;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`
                      font-tiny
                      cursor-pointer rounded-full px-4 py-1.5
                      text-[11px] font-medium uppercase tracking-[0.22em]
                      transition-colors duration-300
                      ${
                        active
                          ? 'bg-red-500/85 text-white'
                          : 'border border-black/15 bg-white/60 text-black/70 hover:border-red-500/40 hover:text-black'
                      }
                    `}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
            <p className="font-body text-center text-[12px] text-black/40">
              {filtered.length}{' '}
              {filtered.length === 1 ? 'article' : 'articles'}
              {query ? (
                <>
                  {' '}
                  matching <span className="text-black/70">"{query}"</span>
                </>
              ) : null}
            </p>
          </div>
        </section>

        {/* Results */}
        <section className="mt-12 md:mt-16">
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
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                  {rest.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              ) : null}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label
      className="
        group relative flex items-center
        rounded-full border border-black/15 bg-white/70
        px-5 py-3.5
        backdrop-blur-md
        transition-colors duration-300
        focus-within:border-red-500/50 focus-within:bg-white
      "
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-3 h-5 w-5 shrink-0 text-black/40 transition-colors group-focus-within:text-red-500"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder="Search articles — try &ldquo;battery&rdquo;, &ldquo;cleaning&rdquo;, &ldquo;hybrid inverter&rdquo;…"
        className="
          font-body
          flex-1 bg-transparent text-[14px] text-black placeholder:text-black/35
          focus:outline-none md:text-[15px]
        "
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="
            ml-3 shrink-0 rounded-full
            p-1 text-black/40 transition-colors
            hover:bg-black/10 hover:text-black
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            className="h-4 w-4"
            aria-hidden
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      ) : null}
    </label>
  );
}

function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <div
      className="
        relative block overflow-hidden
        rounded-[2rem] border border-black/10
        bg-white
        p-8 md:p-12
      "
    >
      <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CategoryPill category={post.category} />
            <span className="font-tiny text-[11px] font-medium uppercase tracking-[0.22em] text-black/45">
              Featured · {post.readMinutes} min read
            </span>
          </div>
          <h2
            className="
              font-heading
              mt-5 text-[clamp(26px,3.2vw,42px)]
              font-semibold leading-[1.08] tracking-tight text-black
            "
            style={{ letterSpacing: '-0.01em' }}
          >
            {post.title}
          </h2>
          <p className="font-body mt-4 max-w-[44rem] text-[15px] leading-relaxed text-black/60 md:text-[16px]">
            {post.excerpt}
          </p>
        </div>
        <div className="flex md:justify-end text-black">
          <InteractiveHoverButton href={`/blog/${post.slug}`}>
            Read article
          </InteractiveHoverButton>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <div
      className="
        relative flex h-full flex-col
        overflow-hidden rounded-2xl
        border border-black/10 bg-white
        p-7
      "
    >
      <div className="flex items-center justify-between">
        <CategoryPill category={post.category} />
        <span className="font-tiny text-[10px] font-medium uppercase tracking-[0.22em] text-black/40">
          {post.readMinutes} min
        </span>
      </div>

      <h3
        className="
          font-heading
          mt-5 text-[18px] font-semibold leading-[1.25]
          tracking-tight text-black
          md:text-[19px]
        "
        style={{ letterSpacing: '-0.005em' }}
      >
        {post.title}
      </h3>

      <p className="font-body mt-3 line-clamp-3 text-[13.5px] leading-relaxed text-black/60">
        {post.excerpt}
      </p>

      <div className="mt-6 text-black">
        <InteractiveHoverButton href={`/blog/${post.slug}`}>
          Read more
        </InteractiveHoverButton>
      </div>
    </div>
  );
}

function CategoryPill({ category }: { category: BlogCategory }) {
  const styles =
    category === 'Hybrid Inverters'
      ? 'bg-red-500/12 text-red-600 ring-red-500/25'
      : 'bg-amber-500/12 text-amber-700 ring-amber-500/25';
  return (
    <span
      className={`
        font-tiny
        inline-flex items-center
        rounded-full px-3 py-1
        text-[10px] font-semibold uppercase tracking-[0.22em]
        ring-1 ring-inset
        ${styles}
      `}
    >
      {category}
    </span>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
      aria-hidden
    >
      <path d="M3 8h10" />
      <path d="M9 4l4 4-4 4" />
    </svg>
  );
}

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
        mx-auto flex max-w-[480px] flex-col items-center
        rounded-2xl border border-black/10 bg-white
        px-8 py-14 text-center
      "
    >
      <div
        className="
          flex h-12 w-12 items-center justify-center
          rounded-full border border-black/10 bg-black/5
        "
      >
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
      <h3 className="font-heading mt-5 text-[18px] font-semibold tracking-tight text-black">
        Nothing matched{query ? ` "${query}"` : ' your filter'}.
      </h3>
      <p className="font-body mt-2 text-[13.5px] leading-relaxed text-black/55">
        Try a different keyword or clear the filters to see every article.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="
          font-tiny
          mt-6 inline-flex cursor-pointer items-center gap-2
          rounded-full bg-red-500/85 px-5 py-2
          text-[11px] font-semibold uppercase tracking-[0.22em] text-white
          transition-colors hover:bg-red-500
        "
      >
        Reset
        <Arrow />
      </button>
    </div>
  );
}
