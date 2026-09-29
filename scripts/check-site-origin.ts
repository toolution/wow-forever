/** Verify the published SEO URLs in dist/ use the configured production host. */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { site } from '../src/config/site';

const dist = path.resolve('dist');
const origin = `https://${site.domain}`;
const errors: string[] = [];
let pageCount = 0;

if (!fs.existsSync(dist)) {
  console.error('dist/ not found; run pnpm build first.');
  process.exit(1);
}

function checkUrl(value: string, location: string): void {
  try {
    if (new URL(value).origin !== origin) errors.push(`${location}: ${value}`);
  } catch {
    errors.push(`${location}: invalid URL ${value}`);
  }
}

function walk(dir: string): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(file);
      continue;
    }
    const relative = path.relative(dist, file).replace(/\\/g, '/');
    if (!relative.endsWith('.html') && !relative.endsWith('.xml') &&
        relative !== 'robots.txt' && relative !== 'llms.txt') continue;

    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('wowforever-guide.pages.dev')) {
      errors.push(`${relative}: legacy pages.dev domain remains`);
    }

    if (relative.endsWith('.html')) {
      // Search Console verification files use .html but contain only a token.
      if (!/<html\b/i.test(content)) continue;
      pageCount++;
      const canonical = [...content.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g)]
        .map(([tag]) => tag.match(/\bhref="([^"]+)"/)?.[1]);
      if (canonical.length !== 1 || !canonical[0]) {
        errors.push(`${relative}: expected exactly one canonical URL`);
      } else {
        const pagePath = relative === '404.html' ? '/404/' :
          relative.replace(/(?:^|\/)index\.html$/, '/');
        const expected = `${origin}${pagePath.startsWith('/') ? pagePath : `/${pagePath}`}`;
        if (canonical[0] !== expected) errors.push(`${relative}: canonical ${canonical[0]} != ${expected}`);
      }
      for (const [tag] of content.matchAll(/<(?:link|meta)\b[^>]*>/g)) {
        if (!/\bhreflang="|\bproperty="og:url"/.test(tag)) continue;
        const value = tag.match(/\b(?:href|content)="([^"]+)"/)?.[1];
        if (value) checkUrl(value, relative);
      }
      continue;
    }

    if (relative.endsWith('.xml')) {
      for (const [, value] of content.matchAll(/<loc>([^<]+)<\/loc>/g)) checkUrl(value, relative);
      for (const [, value] of content.matchAll(/<xhtml:link\b[^>]*href="([^"]+)"/g))
        checkUrl(value, relative);
    } else if (relative === 'robots.txt') {
      const sitemap = content.match(/^Sitemap:\s*(\S+)/m)?.[1];
      if (!sitemap) errors.push('robots.txt: missing Sitemap');
      else checkUrl(sitemap, relative);
    } else {
      for (const [, value] of content.matchAll(/\]\((https?:\/\/[^)]+)\)/g))
        checkUrl(value, relative);
    }
  }
}

walk(dist);
if (pageCount === 0) errors.push('dist/: no HTML pages found');

if (errors.length) {
  console.error(`SEO origin audit failed (${errors.length} issues):`);
  for (const error of errors.slice(0, 30)) console.error(`  ${error}`);
  process.exit(1);
}
console.log(`SEO origin audit passed: ${pageCount} HTML pages and SEO feeds use ${origin}.`);
