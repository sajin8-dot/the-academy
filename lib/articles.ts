// SERVER-ONLY — never import this in Client Components
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import type { Article } from './utils';

export type { Article };
export { formatDate } from './utils';

const coursesDir = path.join(process.cwd(), 'src', 'content', 'courses');

function walkDir(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walkDir(file));
    } else { 
      if (file.endsWith('.md')) {
        results.push(file);
      }
    }
  });
  return results;
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(coursesDir)) return [];

  const filePaths = walkDir(coursesDir);

  const articles = filePaths.map((fullPath) => {
    const fileName = path.basename(fullPath);
    const slug = fileName.replace(/\.md$/, '');
    // Extract course from folder name (e.g., src/content/courses/credit-cards/lesson-1.md -> credit-cards)
    const course = path.dirname(fullPath).split(path.sep).pop() || '';
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug: data.slug || slug,
      course,
      title: data.title || '',
      author: data.author || '',
      authorRole: data.authorRole || '',
      date: data.date || '',
      mode: data.mode || 'story',
      tags: data.tags || [],
      source: data.source || '',
      excerpt: data.excerpt || '',
      starred: data.starred || false,
      heroImage: data.heroImage || null,
    } as Article;
  });

  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!fs.existsSync(coursesDir)) return null;

  const filePaths = walkDir(coursesDir);

  for (const fullPath of filePaths) {
    const fileName = path.basename(fullPath);
    const course = path.dirname(fullPath).split(path.sep).pop() || '';
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const fileSlug = data.slug || fileName.replace(/\.md$/, '');
    if (fileSlug !== slug) continue;

    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    return {
      slug: fileSlug,
      course,
      title: data.title || '',
      author: data.author || '',
      authorRole: data.authorRole || '',
      date: data.date || '',
      mode: data.mode || 'story',
      tags: data.tags || [],
      source: data.source || '',
      excerpt: data.excerpt || '',
      starred: data.starred || false,
      heroImage: data.heroImage || null,
      content,
      contentHtml,
    };
  }

  return null;
}

export async function getArticleByCourseAndLesson(course: string, lesson: string): Promise<Article | null> {
  if (!fs.existsSync(coursesDir)) return null;

  const courseDir = path.join(coursesDir, course);
  if (!fs.existsSync(courseDir)) return null;

  const filePaths = walkDir(courseDir);

  for (const fullPath of filePaths) {
    const fileName = path.basename(fullPath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const fileSlug = data.slug || fileName.replace(/\.md$/, '');
    if (fileSlug !== lesson) continue;

    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    return {
      slug: fileSlug,
      course,
      title: data.title || '',
      author: data.author || '',
      authorRole: data.authorRole || '',
      date: data.date || '',
      mode: data.mode || 'story',
      tags: data.tags || [],
      source: data.source || '',
      excerpt: data.excerpt || '',
      starred: data.starred || false,
      heroImage: data.heroImage || null,
      content,
      contentHtml,
    };
  }

  return null;
}

export function getAllTags(): string[] {
  const articles = getAllArticles();
  const tagSet = new Set<string>();
  articles.forEach((a) => a.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}
