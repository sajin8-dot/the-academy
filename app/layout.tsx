import type { Metadata, Viewport } from 'next';
import { Chewy } from 'next/font/google';
import './globals.css';
import Masthead from '@/components/Masthead';
import DarkModeScript from '@/components/DarkModeScript';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';

const chewy = Chewy({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-chewy',
});

export const metadata: Metadata = {
  title: {
    default: 'The Academy',
    template: '%s | The Academy',
  },
  description: 'Courses and curiculum by Sebastian Chandy.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'The Academy',
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    siteName: 'The Academy',
    title: 'The Academy',
    description: 'Courses and curiculum.',
  },
};

export const viewport: Viewport = {
  themeColor: '#1A1A1A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <DarkModeScript />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.svg" />
      </head>
      <body className={chewy.variable}>
        <ServiceWorkerRegistration />
        <Masthead />
        <main>{children}</main>
        <footer className="mt-16 border-t" style={{ borderColor: 'var(--rule)' }}>
          <div className="max-w-6xl mx-auto px-4 py-8 text-center">
            <p className="byline" style={{ color: 'var(--muted)' }}>
              The Academy · Courses and Curriculum · {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
