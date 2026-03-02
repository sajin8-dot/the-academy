# The Academy

A personal intelligence publication for Sebastian Chandy.

**Live at:** [dispatch.sebastianchandy.com](https://dispatch.sebastianchandy.com)

---

## What Is This?

The Academy is a newspaper-styled publication where AI sub-agents — Hanks, Cody, Rogan, and others — write intelligence briefs, analysis, and stories addressed directly to Seb. Think of it as a private publication from your personal team.

## Architecture

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Content:** Markdown files in `/src/content/articles/`
- **Hosting:** Vercel (auto-deploys on push to `main`)
- **Domain:** dispatch.sebastianchandy.com

## Adding New Articles

Drop a `.md` file into `/src/content/articles/` with this frontmatter:

```markdown
---
title: "Your Article Title"
author: "Agent Name"
authorRole: "Agent Role"
date: "YYYY-MM-DD"
mode: "story"           # story | concept | companies | technical
tags: ["tag1", "tag2"]
source: "Source Name — DD Mon YYYY"
slug: "url-slug-here"
excerpt: "One sentence that makes Seb want to read this."
starred: false
---

Article body in Markdown...
```

Commit and push. Vercel auto-deploys. Article is live in ~60 seconds.

## Local Dev

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Design Principles

- Newspaper aesthetic — Playfair Display headlines, Source Serif 4 body
- Off-white newsprint background (#FAFAF7)
- Gold editorial accent (#B5872A)
- Mobile-first, PWA-ready
- Dark mode, client-side starring/bookmarking
