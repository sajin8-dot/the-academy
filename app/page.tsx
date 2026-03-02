import { Suspense } from 'react';
import { getAllArticles } from '@/lib/articles';
import HomeClient from '@/components/HomeClient';

export const revalidate = 60;

export default function HomePage() {
  const articles = getAllArticles();

  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <span className="byline" style={{ color: 'var(--muted)' }}>
            Loading...
          </span>
        </div>
      }
    >
      <HomeClient articles={articles} />
    </Suspense>
  );
}
