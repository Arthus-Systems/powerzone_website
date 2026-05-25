import Link from 'next/link';
import type { BlogCategory, BlogPost } from '@/data/blog';

const NAV_LINKS = [
  { label: 'Products', href: '/products' },
  { label: 'Applications', href: '/applications' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
];

export default function BlogArticle({
  post,
  related,
}: {
  post: BlogPost;
  related: BlogPost[];
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F4EFE7] text-black">
      {/* Top-left logo */}
      <Link
        href="/"
        aria-label="Power Zone home"
        className="absolute left-8 top-4 z-40"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-on-light.webp"
          alt="Power Zone"
          draggable={false}
          className="pointer-events-none h-16 w-auto select-none"
        />
      </Link>

      {/* Top navbar */}
      <nav className="absolute left-0 right-0 top-0 z-30 h-24 border-b border-black/10 bg-[#F4EFE7]/80 backdrop-blur-md">
        <div
          className="
            flex h-full items-center justify-center gap-3
            text-sm font-bold uppercase tracking-[0.24em] text-black
          "
        >
          {NAV_LINKS.map((link) => {
            const isActive = link.href === '/blog';
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`
                  cursor-pointer rounded-full px-5 py-2
                  transition-colors duration-300
                  ${isActive ? 'bg-red-500/20 text-red-600' : 'hover:bg-black/8'}
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <main
        className="
          relative z-10 mx-auto w-full max-w-[760px]
          px-6 pb-24 pt-32 md:px-8 md:pt-36
        "
      >
        {/* Back link */}
        <Link
          href="/blog"
          className="
            inline-flex items-center gap-2
            text-[11px] font-semibold uppercase tracking-[0.22em] text-black/50
            transition-colors hover:text-red-600
          "
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
            aria-hidden
          >
            <path d="M13 8H3" />
            <path d="M7 4 3 8l4 4" />
          </svg>
          Back to all articles
        </Link>

        {/* Article header */}
        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <CategoryPill category={post.category} />
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-black/45">
              {post.readMinutes} min read
            </span>
          </div>
          <h1
            className="
              mt-6 text-[clamp(28px,3.6vw,46px)]
              font-semibold leading-[1.06] tracking-tight text-black
            "
            style={{ letterSpacing: '-0.01em' }}
          >
            {post.title}
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-black/65 md:text-[16px]">
            {post.excerpt}
          </p>
        </header>

        {/* Divider with red accent */}
        <div
          aria-hidden
          className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-red-500/40 to-transparent"
        />

        {/* Body */}
        <article className="mt-10">
          <ProseBlocks blocks={post.content} />
        </article>

        {/* Tags */}
        {post.tags.length > 0 ? (
          <div className="mt-14 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/35">
              Tags
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="
                  rounded-full border border-black/10 bg-black/[0.04]
                  px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-black/55
                "
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {/* CTA */}
        <CtaPanel />

        {/* Related */}
        {related.length > 0 ? (
          <section className="mt-20">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-red-500">
              Keep Reading
            </p>
            <h2 className="mt-3 text-[clamp(22px,2.6vw,32px)] font-semibold tracking-tight text-black">
              More on{' '}
              <span className="font-serif italic font-normal text-black/70">
                {post.category.toLowerCase()}
              </span>
            </h2>
            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {related.map((r) => (
                <RelatedCard key={r.slug} post={r} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

function ProseBlocks({ blocks }: { blocks: string[] }) {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-black/70 md:text-[16.5px]">
      {blocks.map((block, i) => {
        if (block.startsWith('## ')) {
          return (
            <h3
              key={i}
              className="
                mt-10 text-[19px] font-semibold tracking-tight text-black
                md:text-[21px]
              "
              style={{ letterSpacing: '-0.005em' }}
            >
              {block.replace(/^##\s+/, '')}
            </h3>
          );
        }
        return (
          <p key={i} className="text-black/70">
            {block}
          </p>
        );
      })}
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

function RelatedCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="
        group flex h-full flex-col
        overflow-hidden rounded-2xl
        border border-black/10 bg-white
        p-6
        transition-all duration-500
        hover:-translate-y-1 hover:border-red-500/40
        hover:shadow-[0_22px_55px_-25px_rgba(220,38,38,0.25)]
      "
    >
      <div className="flex items-center justify-between">
        <CategoryPill category={post.category} />
        <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/40">
          {post.readMinutes} min
        </span>
      </div>
      <h3
        className="
          mt-4 text-[16px] font-semibold leading-[1.3]
          tracking-tight text-black
          transition-colors group-hover:text-red-600
          md:text-[17px]
        "
        style={{ letterSpacing: '-0.005em' }}
      >
        {post.title}
      </h3>
      <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-black/55">
        {post.excerpt}
      </p>
    </Link>
  );
}

function CtaPanel() {
  return (
    <div
      className="
        relative mt-16 overflow-hidden
        rounded-2xl border border-black/10
        bg-white
        p-8 md:p-10
      "
    >
      <div className="relative flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-red-500">
            Need a Specialist?
          </p>
          <h3 className="mt-3 text-[20px] font-semibold tracking-tight text-black md:text-[22px]">
            Talk to a Power Zone engineer about your project.
          </h3>
        </div>
        <Link
          href="/contact"
          className="
            inline-flex items-center gap-2
            rounded-full bg-red-500/85 px-5 py-2.5
            text-[11px] font-semibold uppercase tracking-[0.22em] text-white
            transition-colors hover:bg-red-500
          "
        >
          Contact Sales
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
            aria-hidden
          >
            <path d="M3 8h10" />
            <path d="M9 4l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
