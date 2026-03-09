import React from 'react';
import { getLessonData } from '@/lib/lessons'; // Assuming this exists or will be created
import PianoMidiEngine from '@/components/PianoMidiEngine';

import SheetMusic from '@/components/SheetMusic';

export default async function LessonPage({ params }: { params: { course: string, lesson: string } }) {
  const lesson = await getLessonData(params.course, params.lesson);

  const renderContent = (content: string) => {
    // Regex to find [APP ACTION:PianoMidiEngine] and [SHEET_MUSIC: notes="..."]
    const parts = content.split(/(\[APP ACTION:PianoMidiEngine\]|\[SHEET_MUSIC: notes="[^"]+"\])/g);
    return parts.map((part, index) => {
      if (part === '[APP ACTION:PianoMidiEngine]') {
        return <PianoMidiEngine key={index} />;
      }
      if (part.startsWith('[SHEET_MUSIC:')) {
        const notesMatch = part.match(/notes="([^"]+)"/);
        const notes = notesMatch ? notesMatch[1] : '';
        return <SheetMusic key={index} notes={notes} />;
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
