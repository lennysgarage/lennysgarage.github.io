# My Portfolio Website

## https://lennysgarage.github.io/
![chrome_9TSprArGpl](https://user-images.githubusercontent.com/17188326/169947015-92d3f7ad-bf49-4643-9f5b-51cfe26b5712.png)

## To Deploy
```bash
npm run deploy
```
This runs `npm run build` (which first regenerates the blog manifest + RSS feed via `scripts/build-blog-manifest.js`) and pushes the `build/` folder to the `gh-pages` branch.

## Blog

Blog posts are Markdown files with YAML frontmatter in `public/blog/`. A build
script scans them and generates:

- `public/blog/blog-manifest.json` — consumed by the React SPA at runtime.
- `public/blog/index.xml` — an RSS 2.0 feed.

To add a post, drop a `public/blog/<slug>.md` file in with this frontmatter:

```markdown
---
title: "Post Title"
date: "2026-07-14"
excerpt: "Optional one-line summary."
---

Body in Markdown...
```

The `slug` defaults to the filename; set `excerpt` to override the auto-derived
summary. `npm start` and `npm run build` regenerate the manifest and RSS feed
automatically (via `prestart` / `prebuild`). Article URLs follow
`/blog/YYYY/MM/DD/<slug>/`, derived from the `date` field.

### Deep-link / 404 handling on GitHub Pages

This is a Create React App SPA. GitHub Pages serves static files only, so a
direct request to a deep link like `/blog/2026/01/18/my-first-post/` resolves to
no file on disk and returns HTTP **404**. To keep deep links working, the repo
ships `public/404.html` with a redirect shim: it rewrites the requested path into
a `?p=` query parameter and redirects to `/` (served as `index.html` with HTTP
**200**). A matching restore script in `public/index.html` then rewrites the
browser history back to the original path so React Router renders the right
route.

Caveat: the *initial* fetch of a deep link still returns 404 to crawlers that
don't execute the redirect. Full HTTP 200 on every article URL requires a
static-site generator or a GitHub Actions deploy that pre-renders each route —
not used in the current SPA setup.
