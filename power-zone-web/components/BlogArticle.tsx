/* -----------------------------------------------------------------------------
 * BlogArticle — structured editorial article for /blog/[slug].
 *
 * Layout:
 *   - Slim breadcrumb rail at top
 *   - Article body lives in a single bordered card (white, rounded, soft
 *     shadow) so the page has a clear vertical structure instead of
 *     floating text on a tinted background
 *   - Inside the card: header (category eyebrow + title + lede), accent
 *     rule, body with raised cap + section numerals, tags row
 *   - CTA in its own bordered card
 *   - Related articles in their own card grid (3-up lg, 2-up md, 1-up sm)
 * -------------------------------------------------------------------------- */

import Link from 'next/link';
import type { BlogCategory, BlogPost } from '@/data/blog';
import Navbar from '@/components/Navbar';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

export default function BlogArticle({
  post,
  related,
}: {
  post: BlogPost;
  related: BlogPost[];
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F4EFE7] text-black">
      <div className="absolute left-0 right-0 top-0 z-30">
        <Navbar />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-[820px] px-6 pb-28 pt-28 md:px-8 md:pt-36">
        {/* Breadcrumb rail */}
        <div className="mb-6 flex items-center justify-between gap-4 px-2">
          <Link
            href="/blog"
            className="font-tiny inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-black/55 transition-colors hover:text-red-600"
          >
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
              <path d="M13 8H3" />
              <path d="M7 4 3 8l4 4" />
            </svg>
            Back to the Journal
          </Link>
          <span className="font-tiny text-[10.5px] uppercase tracking-[0.24em] text-black/40">
            {post.readMinutes} min read
          </span>
        </div>

        {/* MAIN ARTICLE CARD — gives the body real structure on the
            tinted page background. Header, body, tags all live inside. */}
        <article
          className="
            relative overflow-hidden
            rounded-2xl border border-black/10 bg-white
            shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04),0_30px_70px_-30px_rgba(0,0,0,0.16)]
            px-7 py-10 md:px-12 md:py-14
          "
        >
          {/* Header */}
          <header>
            <CategoryAccent category={post.category} />
            <h1
              className="
                font-heading mt-5
                text-[clamp(28px,4vw,48px)] font-semibold
                leading-[1.06] tracking-tight text-black
              "
              style={{ letterSpacing: '-0.015em' }}
            >
              {post.title}
            </h1>
            <p className="font-body mt-5 text-[16px] leading-[1.7] text-black/65 md:text-[17px]">
              {post.excerpt}
            </p>
          </header>

          {/* Accent divider between header and body */}
          <div
            aria-hidden
            className="mt-10 h-px w-full bg-gradient-to-r from-black/15 via-red-500/40 to-black/15"
          />

          {/* Body */}
          <div className="mt-10">
            <ProseBlocks blocks={post.content} />
          </div>

          {/* Tags */}
          {post.tags.length > 0 ? (
            <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-black/10 pt-6">
              <span className="font-tiny mr-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-black/45">
                Filed Under
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="
                    font-tiny rounded-full border border-black/12 bg-black/[0.03]
                    px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.2em] text-black/60
                  "
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </article>

        {/* CTA — separate card so it doesn't blur with the article body */}
        <CtaPanel />

        {/* Related */}
        {related.length > 0 ? (
          <section className="mt-16">
            <div className="mb-5 flex items-center gap-4 px-1">
              <span aria-hidden className="h-px w-10 bg-red-600" />
              <p className="font-tiny text-[10.5px] font-semibold uppercase tracking-[0.32em] text-red-600">
                Keep Reading
              </p>
            </div>
            <h2
              className="font-heading px-1 text-[clamp(22px,2.6vw,30px)] font-semibold tracking-tight text-black"
              style={{ letterSpacing: '-0.01em' }}
            >
              More on{' '}
              <span className="font-heading italic font-normal text-black/65">
                {post.category.toLowerCase()}
              </span>
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {related.map((r, i) => (
                <RelatedCard key={r.slug} post={r} index={i + 1} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

/* ── ProseBlocks ──────────────────────────────────────────────────────
 * Body text renderer. First non-heading paragraph gets a raised initial
 * letter for editorial feel. Section headings get a numbered red
 * eyebrow + accent rule so the article structure is visible at a
 * glance without relying solely on h3 weight. */
function ProseBlocks({ blocks }: { blocks: string[] }) {
  let leadFound = false;
  let sectionIdx = 0;
  return (
    <div className="font-body space-y-5 text-[15.5px] leading-[1.78] text-black/72 md:text-[16.5px]">
      {blocks.map((block, i) => {
        if (block.startsWith('## ')) {
          sectionIdx += 1;
          const heading = block.replace(/^##\s+/, '');
          return (
            <div key={i} className="pt-10">
              <div className="mb-3 flex items-baseline gap-3">
                <span
                  className="font-heading italic text-[14px] leading-none text-red-600"
                  style={{ letterSpacing: '-0.01em' }}
                  aria-hidden
                >
                  {String(sectionIdx).padStart(2, '0')}
                </span>
                <span aria-hidden className="h-px w-8 bg-black/25" />
              </div>
              <h3
                className="font-heading text-[20px] font-semibold tracking-tight text-black md:text-[23px]"
                style={{ letterSpacing: '-0.005em' }}
              >
                {heading}
              </h3>
            </div>
          );
        }

        if (!leadFound) {
          leadFound = true;
          const first = block.charAt(0);
          const rest = block.slice(1);
          return (
            <p key={i} className="font-body text-black/75">
              <span
                aria-hidden
                className="font-heading float-left mr-2 mt-1 text-[48px] leading-[0.85] text-red-700 md:text-[58px]"
                style={{ letterSpacing: '-0.02em' }}
              >
                {first}
              </span>
              {rest}
            </p>
          );
        }

        return (
          <p key={i} className="font-body text-black/72">
            {block}
          </p>
        );
      })}
    </div>
  );
}

/* ── CategoryAccent ─────────────────────────────────────────────────── */
function CategoryAccent({ category }: { category: BlogCategory }) {
  const accent =
    category === 'Hybrid Inverters' ? 'text-red-600' : 'text-amber-700';
  return (
    <div className="flex items-center gap-4">
      <span aria-hidden className={`h-px w-10 bg-current ${accent}`} />
      <span
        className={`font-tiny text-[10.5px] font-semibold uppercase tracking-[0.32em] ${accent}`}
      >
        {category}
      </span>
    </div>
  );
}

/* ── RelatedCard ─────────────────────────────────────────────────────
 * Same compact card pattern as BlogIndex's PostCard so the article
 * page's Related grid matches the index visually. */
function RelatedCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="
        group relative flex h-full flex-col
        overflow-hidden rounded-2xl
        border border-black/10 bg-white
        shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04),0_18px_48px_-22px_rgba(0,0,0,0.10)]
        p-6
        transition-all duration-300
        hover:-translate-y-1 hover:border-black/25
        hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08),0_24px_60px_-22px_rgba(0,0,0,0.18)]
      "
    >
      <div className="flex items-start justify-between gap-4">
        <CategoryAccent category={post.category} />
        <span
          className="font-heading italic leading-none text-black/15 text-[22px] tabular-nums"
          style={{ letterSpacing: '-0.01em' }}
          aria-hidden
        >
          {String(index).padStart(2, '0')}
        </span>
      </div>
      <h3
        className="
          font-heading mt-4 text-[16px] font-semibold leading-[1.25]
          tracking-tight text-black
          transition-colors group-hover:text-red-700
          md:text-[17px]
        "
        style={{ letterSpacing: '-0.005em' }}
      >
        {post.title}
      </h3>
      <p className="font-body mt-3 line-clamp-2 text-[13px] leading-relaxed text-black/55">
        {post.excerpt}
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-3">
        <span className="font-tiny text-[10px] font-semibold uppercase tracking-[0.22em] text-black/40">
          {post.readMinutes} min
        </span>
        <span className="font-tiny inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/70 group-hover:text-red-600">
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
      </div>
    </Link>
  );
}

/* ── CtaPanel ────────────────────────────────────────────────────────
 * Bordered CTA card. Sits below the article body. */
function CtaPanel() {
  return (
    <div
      className="
        relative mt-10 overflow-hidden
        rounded-2xl border border-black/10 bg-white
        shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04),0_22px_56px_-25px_rgba(0,0,0,0.14)]
        p-7 md:p-10
      "
    >
      <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="md:max-w-[28rem]">
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-red-600" />
            <p className="font-tiny text-[10.5px] font-semibold uppercase tracking-[0.32em] text-red-600">
              Need A Specialist?
            </p>
          </div>
          <h3
            className="font-heading mt-4 text-[clamp(20px,2.4vw,26px)] font-semibold leading-[1.15] tracking-tight text-black"
            style={{ letterSpacing: '-0.01em' }}
          >
            Talk to a Power Zone engineer about{' '}
            <span className="font-heading italic font-normal text-black/65">
              your project.
            </span>
          </h3>
        </div>
        <div className="text-black">
          <InteractiveHoverButton href="/contact">
            Contact Sales
          </InteractiveHoverButton>
        </div>
      </div>
    </div>
  );
}
