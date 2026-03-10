'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Masthead() {
  const [dark, setDark] = useState(false);
  const [today, setToday] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('dispatch-theme');
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(stored === 'dark' || (!stored && sysDark));

    const d = new Date();
    setToday(
      d.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dispatch-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dispatch-theme', 'light');
    }
  };

  return (
    <header className="max-w-6xl mx-auto px-4 pt-8 pb-0">
      {/* Top meta bar */}
      <div className="flex items-center justify-between mb-4" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
        <span className="byline" style={{ color: 'var(--muted)' }}>
          {today}
        </span>
        <div className="flex items-center gap-4">
          <span
            className="byline dispatch-tagline"
            style={{ color: 'var(--muted)', fontStyle: 'italic' }}
          >
            Courses and Curriculum
          </span>
          <button
            onClick={toggleDark}
            className="byline px-2 py-1 rounded hover:opacity-70 transition-opacity"
            style={{
              border: '1px solid var(--rule)',
              color: 'var(--muted)',
              background: 'transparent',
            }}
            aria-label="Toggle dark mode"
          >
            {dark ? '☀ Light' : '☽ Dark'}
          </button>
        </div>
      </div>

      {/* Masthead double rule */}
      <div
        style={{
          borderTop: '3px solid var(--ink)',
          borderBottom: '1px solid var(--ink)',
          height: '5px',
          marginBottom: '0.75rem',
        }}
      />

      {/* THE ACADEMY wordmark */}
      <div className="text-center py-4">
        <Link href="/" className="headline-display" style={{ textDecoration: 'none' }}>
          <h1
            className="headline-display"
            style={{
              fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'var(--ink)',
              lineHeight: 1,
              margin: 0,
            }}
          >
            The Academy
          </h1>
        </Link>
      </div>

      {/* Bottom double rule */}
      <div
        style={{
          borderTop: '1px solid var(--ink)',
          borderBottom: '3px solid var(--ink)',
          height: '5px',
          marginBottom: '0',
        }}
      />

      {/* Nav bar */}
      <nav
        style={{
          borderBottom: '1px solid var(--rule)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.25rem 1.25rem',
          padding: '0.6rem 0.5rem',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <Link href="/" className="nav-link" style={{ whiteSpace: 'nowrap' }}>All</Link>
        <Link href="/?mode=credit-cards" className="nav-link" style={{ whiteSpace: 'nowrap' }}>Credit Cards</Link>
        <Link href="/?mode=piano" className="nav-link" style={{ whiteSpace: 'nowrap' }}>Piano</Link>
        <Link href="/?mode=fitness" className="nav-link" style={{ whiteSpace: 'nowrap' }}>Fitness</Link>
        <span style={{ color: 'var(--rule)', fontSize: '0.75rem' }}>|</span>
        <Link href="/?filter=saved" className="nav-link" style={{ color: 'var(--gold)', whiteSpace: 'nowrap' }}>★ Saved</Link>
      </nav>
    </header>
  );
}
