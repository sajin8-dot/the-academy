import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllArticles, getArticleByCourseAndLesson, formatDate } from '@/lib/articles';
import StarButton from '@/components/StarButton';

interface Props {
  params: { course: string; lesson: string };
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({ 
    course: a.course || 'unknown', 
    lesson: a.slug 
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleByCourseAndLesson(params.course, params.lesson);
  if (!article) return { title: 'Not Found' };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: [`${article.author} — ${article.authorRole}`],
      ...(article.heroImage ? { images: [{ url: article.heroImage }] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleByCourseAndLesson(params.course, params.lesson);
  if (!article) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Back nav */}
      <div className="mb-8">
        <Link
          href="/"
          className="byline"
          style={{ color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          ← The Academy
        </Link>
      </div>

      {/* Article header */}
      <div
        className="max-w-3xl mx-auto"
        style={{ borderTop: '2px solid var(--ink)', paddingTop: '2rem' }}
      >
        {/* Mode + tags */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className={`tag-chip mode-${article.mode}`}>{article.mode.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
          {article.tags.map((tag) => (
            <span key={tag} className="tag-chip">{tag}</span>
          ))}
        </div>

        {/* Headline */}
        <h1
          className="headline-display headline-article mb-6"
          style={{ color: 'var(--ink)' }}
        >
          {article.title}
        </h1>

        {/* Byline row */}
        <div
          className="flex items-center justify-between gap-4 mb-4"
          style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', padding: '0.75rem 0' }}
        >
          <div>
            <span className="byline">
              By {article.author}, {article.authorRole}
            </span>
            <span className="byline" style={{ margin: '0 0.5rem', color: 'var(--rule)' }}>·</span>
            <span className="byline">{formatDate(article.date)}</span>
          </div>
          <StarButton slug={article.slug} size="lg" />
        </div>

        {/* Source line */}
        <p
          className="font-serif-body mb-8"
          style={{
            fontSize: '0.85rem',
            fontStyle: 'italic',
            color: 'var(--muted)',
          }}
        >
          From: {article.source}
        </p>

        {/* Hero image */}
        {article.heroImage && (
          <div
            style={{
              width: '100%',
              marginBottom: '2rem',
              borderRadius: '2px',
              overflow: 'hidden',
              position: 'relative',
              aspectRatio: '16/9',
            }}
          >
            <Image
              src={article.heroImage}
              alt={article.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        {/* Excerpt / lede */}
        <p
          className="font-playfair mb-8"
          style={{
            fontSize: '1.2rem',
            fontStyle: 'italic',
            lineHeight: 1.65,
            color: 'var(--ink)',
            borderLeft: '3px solid var(--gold)',
            paddingLeft: '1.25rem',
          }}
        >
          {article.excerpt}
        </p>

        {/* Article body */}
        <div
          className="article-body mx-auto"
          dangerouslySetInnerHTML={{ __html: article.contentHtml || '' }}
        />

        {/* Bottom tags */}
        <div
          className="mt-12 pt-6"
          style={{ borderTop: '1px solid var(--rule)' }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="byline" style={{ color: 'var(--muted)' }}>Filed under:</span>
            {article.tags.map((tag) => (
              <Link key={tag} href={`/?tag=${tag}`}>
                <span className="tag-chip" style={{ cursor: 'pointer' }}>#{tag}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8">
          <Link
            href="/"
            className="byline"
            style={{
              color: 'var(--gold)',
              borderBottom: '1px solid var(--gold)',
              paddingBottom: '1px',
            }}
          >
            ← Back to The Academy
          </Link>
        </div>
      </div>
    </div>
  );
}
