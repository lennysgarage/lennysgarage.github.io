#!/usr/bin/env node
/**
 * Blog manifest + RSS feed + per-post JSON generator.
 *
 * Reads markdown posts from content/blog/*.md, parses YAML frontmatter, and
 * writes into public/blog/:
 *   - blog-manifest.json        (list of posts consumed by the React SPA)
 *   - index.xml                 (RSS 2.0 feed, linked from the blog)
 *   - <slug>.json per post      (title/date/excerpt/content, fetched on demand)
 *
 * GitHub Pages does NOT serve raw .md files, so the source markdown lives in
 * content/blog/ (outside public/) and is converted to JSON at build time. The
 * SPA therefore never fetches .md at runtime.
 *
 * Run automatically via `npm run build-blog` (wired into prestart/prebuild).
 *
 * Frontmatter fields:
 *   title:   "Post Title"        (required)
 *   date:    YYYY-MM-DD          (required)
 *   excerpt: "Short summary"     (optional; auto-derived from body if absent)
 *   slug:    custom-slug         (optional; derived from filename if absent)
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'blog');
const OUT_DIR = path.join(__dirname, '..', 'public', 'blog');
const MANIFEST_PATH = path.join(OUT_DIR, 'blog-manifest.json');
const RSS_PATH = path.join(OUT_DIR, 'index.xml');

const SITE_URL = 'https://lennysgarage.github.io';
const BLOG_BASE = '/blog';
const AUTHOR = 'Jonathan Marcantonio';
const FEED_TITLE = 'lennysgarage — Articles';
const FEED_DESC = 'Thoughts, experiences, and learnings by Jonathan Marcantonio.';

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function pad(n) { return String(n).padStart(2, '0'); }

function toRfc822(date) {
  return date.toUTCString().replace('GMT', '+0000');
}

function loadPosts() {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'));

  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8');
    const { data: fm, content } = matter(raw);

    const slug = fm.slug || filename.replace(/\.md$/, '');
    const dateStr = fm.date;
    const date = dateStr ? new Date(`${dateStr}T00:00:00Z`) : new Date(NaN);
    const title = fm.title || slug;

    const excerpt =
      fm.excerpt ||
      stripMarkdown(content).slice(0, 180).trim() + '…';

    return {
      slug,
      filename: `${slug}.json`,
      date: dateStr,
      title,
      excerpt,
      dateObj: date,
      content,
    };
  });

  posts.sort((a, b) => b.dateObj - a.dateObj);
  return posts;
}

function writeManifest(posts) {
  const manifest = posts.map((p) => ({
    slug: p.slug,
    filename: p.filename,
    date: p.date,
    title: p.title,
    excerpt: p.excerpt,
  }));
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Wrote ${manifest.length} entries to ${path.relative(process.cwd(), MANIFEST_PATH)}`);
}

function writePostJson(posts) {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  posts.forEach((p) => {
    const outPath = path.join(OUT_DIR, p.filename);
    const payload = {
      slug: p.slug,
      title: p.title,
      date: p.date,
      excerpt: p.excerpt,
      content: p.content,
    };
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n');
  });
  console.log(`Wrote ${posts.length} post JSON files to ${path.relative(process.cwd(), OUT_DIR)}`);
}

function writeRss(posts) {
  const latest = posts[0] ? toRfc822(posts[0].dateObj) : toRfc822(new Date());
  const items = posts.map((p) => {
    const y = p.dateObj.getUTCFullYear();
    const m = pad(p.dateObj.getUTCMonth() + 1);
    const d = pad(p.dateObj.getUTCDate());
    const url = `${SITE_URL}${BLOG_BASE}/${y}/${m}/${d}/${p.slug}/`;
    return [
      '    <item>',
      `      <title>${escapeXml(p.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <pubDate>${toRfc822(p.dateObj)}</pubDate>`,
      `      <description>${escapeXml(p.excerpt)}</description>`,
      '    </item>',
    ].join('\n');
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}${BLOG_BASE}/</link>
    <description>${escapeXml(FEED_DESC)}</description>
    <language>en-us</language>
    <lastBuildDate>${latest}</lastBuildDate>
    <atom:link href="${SITE_URL}${BLOG_BASE}/index.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  fs.writeFileSync(RSS_PATH, xml);
  console.log(`Wrote RSS feed to ${path.relative(process.cwd(), RSS_PATH)}`);
}

const posts = loadPosts();
writeManifest(posts);
writePostJson(posts);
writeRss(posts);
console.log('Blog build complete.');
