'use client';

import { useState, useEffect } from 'react';

interface StarButtonProps {
  slug: string;
  size?: 'sm' | 'lg';
}

export default function StarButton({ slug, size = 'sm' }: StarButtonProps) {
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('dispatch-starred') || '{}'
      );
      setStarred(!!saved[slug]);
    } catch {
      setStarred(false);
    }
  }, [slug]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = JSON.parse(
        localStorage.getItem('dispatch-starred') || '{}'
      );
      const next = !starred;
      if (next) {
        saved[slug] = true;
      } else {
        delete saved[slug];
      }
      localStorage.setItem('dispatch-starred', JSON.stringify(saved));
      setStarred(next);
    } catch {}
  };

  const fontSize = size === 'lg' ? '1.5rem' : '1rem';

  return (
    <button
      onClick={toggle}
      className={`star-btn ${starred ? 'starred' : ''}`}
      style={{ fontSize }}
      aria-label={starred ? 'Remove from saved' : 'Save article'}
      title={starred ? 'Saved' : 'Save'}
    >
      {starred ? '★' : '☆'}
    </button>
  );
}
