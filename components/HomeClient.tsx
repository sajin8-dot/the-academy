'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Article } from '@/lib/utils';
import ArticleCard from './ArticleCard';

interface HomeClientProps {
  articles: Article[];
}

export default function HomeClient({ articles }: HomeClientProps) {
  const searchParams = useSearchParams();
  const modeFilter = searchParams.get('mode') || '';
  const filterParam = searchParams.get('filter') || '';

  const [starredSlugs, setStarredSlugs] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = JSON.parse(
        localStorage.getItem('dispatch-starred') || '{}'
      );
      setStarredSlugs(new Set(Object.keys(saved).filter((k) => saved[k])));
    } catch {
      setStarredSlugs(new Set());
    }

    // Listen for star changes
    const handleStorage = () => {
      try {
        const saved = JSON.parse(
          localStorage.getItem('dispatch-starred') || '{}'
        );
        setStarredSlugs(new Set(Object.keys(saved).filter((k) => saved[k])));
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  let filtered = articles;

  if (filterParam === 'saved' && mounted) {
    filtered = articles.filter((a) => starredSlugs.has(a.slug));
  } else if (modeFilter) {
    filtered = articles.filter((a) => a.mode === modeFilter);
  }

  const featured = filtered[0];
  const rest = filtered.slice(1);

  if (filterParam === 'saved' && mounted && filtered.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p
          className="font-playfair"
          style={{ fontSize: '1.3rem', color: 'var(--muted)', fontStyle: 'italic' }}
        >
          No saved articles yet. Star articles with ☆ to find them here.
        </p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p
          className="font-playfair"
          style={{ fontSize: '1.3rem', color: 'var(--muted)', fontStyle: 'italic' }}
        >
          No articles in this category yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Active filter indicator */}
      {(modeFilter || filterParam === 'saved') && (
        <div className="mb-6 flex items-center gap-3">
          <span className="byline" style={{ color: 'var(--muted)' }}>
            {filterParam === 'saved'
              ? `★ ${filtered.length} saved article${filtered.length !== 1 ? 's' : ''}`
              : `${filtered.length} article${filtered.length !== 1 ? 's' : ''} · ${modeFilter.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`}
          </span>
          <a
            href="/"
            className="byline"
            style={{ color: 'var(--gold)', textDecoration: 'underline' }}
          >
            Clear
          </a>
        </div>
      )}

      {/* Featured article */}
      {featured && <ArticleCard article={featured} featured />}

      {/* Grid */}
      {rest.length > 0 && (
        <div
          className="grid gap-0 col-rule"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '0',
          }}
        >
          {rest.map((article) => (
            <div key={article.slug} style={{ paddingTop: '1.25rem', paddingBottom: '1.25rem' }}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
