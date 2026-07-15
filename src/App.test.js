import { parseFrontmatter } from './utils/parseFrontmatter';

test('parses frontmatter and body separately', () => {
  const md = `---\ntitle: "Hello World"\ndate: "2026-01-18"\nexcerpt: "A short summary"\n---\n\n# Heading\n\nBody text here.`;
  const { data, content } = parseFrontmatter(md);
  expect(data.title).toBe('Hello World');
  expect(data.date).toBe('2026-01-18');
  expect(data.excerpt).toBe('A short summary');
  expect(content.startsWith('# Heading')).toBe(true);
});

test('strips surrounding quotes from single and double quoted values', () => {
  const md = `---\na: 'single'\nb: "double"\nc: bare\n---\n\nbody`;
  const { data } = parseFrontmatter(md);
  expect(data.a).toBe('single');
  expect(data.b).toBe('double');
  expect(data.c).toBe('bare');
});

test('returns empty frontmatter when none present', () => {
  const md = `Just some text with no frontmatter.`;
  const { data, content } = parseFrontmatter(md);
  expect(data).toEqual({});
  expect(content).toBe('Just some text with no frontmatter.');
});
