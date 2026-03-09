import React from 'react';
import { getLessonData } from '@/lib/lessons'; // Assuming this exists or will be created
import PianoMidiEngine from '@/components/PianoMidiEngine';

export default async function LessonPage({ params }: { params: { course: string, lesson: string } }) {
  const lesson = await getLessonData(params.course, params.lesson);

  const renderContent = (content: string) => {
    // Basic regex to find [APP ACTION:PianoMidiEngine]
    const parts = content.split(/(\[APP ACTION:PianoMidiEngine\])/g);
    return parts.map((part, index) => {
      if (part === '[APP ACTION:PianoMidiEngine]') {
        return <PianoMidiEngine key={index} />;
      }
      return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
      <div className="prose lg:prose-xl">
        {renderContent(lesson.contentHtml)}
      </div>
    </div>
  );
}
