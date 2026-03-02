import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import StarButton from './StarButton';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({
  article,
  featured = false,
}: ArticleCardProps) {
  if (featured) {
    return (
      <div
        className="fade-in"
        style={{
          borderTop: '2px solid var(--ink)',
          borderBottom: '1px solid var(--rule)',
          paddingTop: '1.5rem',
          paddingBottom: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Mode + tag */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`tag-chip mode-${article.mode}`}
              >
                {article.mode.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </span>
              {article.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>

            {/* Featured headline */}
            <Link href={`/article/${article.slug}`}>
              <h2
                className="headline-display headline-featured mb-3"
                style={{
                  maxWidth: '800px',
                }}
              >
                {article.title}
              </h2>
            </Link>

            {/* Excerpt */}
            <p
              className="font-serif-body mb-3"
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.65,
                color: 'var(--ink)',
                maxWidth: '640px',
              }}
            >
              {article.excerpt}
            </p>

            {/* Byline */}
            <div className="flex items-center gap-3">
              <span className="byline">
                By {article.author}, {article.authorRole}
              </span>
              <span style={{ color: 'var(--rule)' }}>·</span>
              <span className="byline">{formatDate(article.date)}</span>
            </div>
          </div>

          {/* Star */}
          <div className="pt-1">
            <StarButton slug={article.slug} />
          </div>
        </div>
      </div>
    );
  }

  // Grid card
  return (
    <div className="article-card fade-in">
      {/* Thumbnail image */}
      {article.heroImage && (
        <Link href={`/article/${article.slug}`}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16/9',
              marginBottom: '0.85rem',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <Image
              src={article.heroImage}
              alt={article.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </Link>
      )}

      <div className="flex justify-between items-start gap-2">
        <span className={`tag-chip mode-${article.mode} mb-2`}>
          {article.mode.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </span>
        <StarButton slug={article.slug} />
      </div>

      <Link href={`/article/${article.slug}`}>
        <h3
          className="headline-display mb-2"
          style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.45rem)', lineHeight: 1.2 }}
        >
          {article.title}
        </h3>
      </Link>

      <p
        className="font-serif-body mb-3"
        style={{ fontSize: '0.95rem', lineHeight: 1.65, color: 'var(--muted)' }}
      >
        {article.excerpt}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <span className="byline">By {article.author}, {article.authorRole}</span>
        <span style={{ color: 'var(--rule)', fontSize: '0.7rem' }}>·</span>
        <span className="byline">{formatDate(article.date)}</span>
      </div>

      <div className="flex flex-wrap gap-1 mt-2">
        {article.tags.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
