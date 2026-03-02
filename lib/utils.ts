// Pure utility functions — safe for both client and server

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export type ArticleMode = 'story' | 'concept' | 'companies' | 'technical';

export interface Article {
  slug: string;
  title: string;
  author: string;
  authorRole: string;
  date: string;
  mode: ArticleMode;
  tags: string[];
  source: string;
  excerpt: string;
  starred: boolean;
  heroImage?: string;
  content?: string;
  contentHtml?: string;
}
