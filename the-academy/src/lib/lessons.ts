import { courses, Course, Lesson } from './courses';
import { remark } from 'remark';
import html from 'remark-html';

export async function getLessonData(courseSlug: string, lessonSlug: string) {
  // Find the course by slug (for now matching title)
  const course = courses.find(c => c.title.toLowerCase().replace(/\s+/g, '-') === courseSlug);
  
  if (!course) {
    throw new Error(`Course ${courseSlug} not found`);
  }

  const lesson = course.lessons.find(l => l.slug === lessonSlug);

  if (!lesson) {
    throw new Error(`Lesson ${lessonSlug} not found`);
  }

  // Convert markdown to HTML string
  const processedContent = await remark()
    .use(html)
    .process(lesson.content);
  const contentHtml = processedContent.toString();

  return {
    ...lesson,
    contentHtml
  };
}
