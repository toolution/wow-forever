import { describe, it, expect } from 'vitest';
import {
  localizePath,
  listPath,
  detailPath,
  homeUrl,
  slugifyTag,
  absoluteUrl,
  languageAlternates,
} from '~/lib/url';
import { locales, officialForeverUrl } from '~/i18n/routing';

describe('url helpers', () => {
  describe('localizePath', () => {
    it('returns the path unchanged for the default locale (zh)', () => {
      expect(localizePath('/bosses', 'zh')).toBe('/bosses/');
      expect(localizePath('/bosses/emberfang', 'zh')).toBe('/bosses/emberfang/');
    });

    it('prepends the locale prefix for non-default locales', () => {
      expect(localizePath('/bosses', 'ja-jp')).toBe('/ja-jp/bosses/');
      expect(localizePath('/bosses/emberfang', 'ja-jp')).toBe('/ja-jp/bosses/emberfang/');
    });

    it('ensures leading slash on input without one', () => {
      expect(localizePath('about', 'zh')).toBe('/about/');
      expect(localizePath('about', 'ja-jp')).toBe('/ja-jp/about/');
    });
  });

  describe('homeUrl', () => {
    it('returns / for default locale', () => {
      expect(homeUrl('zh')).toBe('/');
    });
    it('returns /ja for non-default locale', () => {
      expect(homeUrl('ja-jp')).toBe('/ja-jp/');
    });
  });

  describe('listPath', () => {
    it('builds the correct list URL for each locale', () => {
      expect(listPath('bosses', 'zh')).toBe('/bosses/');
      expect(listPath('bosses', 'ja-jp')).toBe('/ja-jp/bosses/');
      expect(listPath('codes', 'zh')).toBe('/codes/');
    });
  });

  describe('detailPath', () => {
    it('builds the correct article URL for each locale', () => {
      expect(detailPath('bosses', 'emberfang', 'zh')).toBe('/bosses/emberfang/');
      expect(detailPath('bosses', 'emberfang', 'ja-jp')).toBe('/ja-jp/bosses/emberfang/');
    });

    it('handles nested slugs', () => {
      expect(detailPath('guides', 'early-game/beginner', 'zh')).toBe(
        '/guides/early-game/beginner/',
      );
      expect(detailPath('guides', 'early-game/beginner', 'ja-jp')).toBe(
        '/ja-jp/guides/early-game/beginner/',
      );
    });
  });
});

describe('slugifyTag (CJK / non-ASCII fallback)', () => {
  it('slugifies ASCII tags to lowercase kebab-case', () => {
    expect(slugifyTag('Boss Guide')).toBe('boss-guide');
    expect(slugifyTag('Fire_Warden')).toBe('fire-warden');
  });

  it('returns CJK tags raw instead of collapsing to empty', () => {
    // The ASCII branch strips every CJK char → '' → all such tags would
    // collide on /tags/. The raw fallback keeps them unique; Astro writes
    // params to disk verbatim, so the built directory is the raw tag and
    // browser-encoded links (/tags/%E7%84%B0…) resolve to it.
    const zh = slugifyTag('焰牙');
    expect(zh).toBe('焰牙');
    expect(zh).not.toBe('');
  });

  it('keeps two different CJK tags distinguishable', () => {
    expect(slugifyTag('焰牙')).not.toBe(slugifyTag('风暴召唤者'));
  });

  it('keeps pure-symbol tags non-empty', () => {
    // Whatever the exact characters, the slug is stable and distinct from ''
    // — the property the fallback exists to guarantee.
    expect(slugifyTag('!!!')).toBe('!!!');
    expect(slugifyTag('  ???  ')).toBe('???');
  });
});

describe('absoluteUrl', () => {
  it('prefixes siteUrl and applies the locale prefix rules', () => {
    expect(absoluteUrl('/bosses', 'zh')).toMatch(/^https:\/\/[^/]+\/bosses\/$/);
    expect(absoluteUrl('/bosses', 'ja-jp')).toMatch(/^https:\/\/[^/]+\/ja-jp\/bosses\/$/);
    expect(absoluteUrl('/', 'ja-jp')).toMatch(/^https:\/\/[^/]+\/ja-jp\/$/);
  });
});

describe('languageAlternates', () => {
  it('builds absolute hreflang entries for exactly the given locales', () => {
    const alts = languageAlternates((loc) => detailPath('bosses', 'x', loc), ['zh', 'en']);
    expect(alts).toHaveLength(2);
    expect(alts[0]).toEqual({ hreflang: 'zh-CN', href: expect.stringMatching(/\/bosses\/x\/$/) });
    expect(alts[1]).toEqual({ hreflang: 'en-US', href: expect.stringMatching(/\/en\/bosses\/x\/$/) });
  });

  it('never emits x-default (BaseLayout derives it separately)', () => {
    const alts = languageAlternates((loc) => listPath('guides', loc), ['zh', 'en']);
    expect(alts.some((a) => a.hreflang === 'x-default')).toBe(false);
  });

  it('honors a reduced locale list (single-language article)', () => {
    const alts = languageAlternates((loc) => detailPath('bosses', 'x', loc), ['ja-jp']);
    expect(alts).toHaveLength(1);
    expect(alts[0].hreflang).toBe('ja-JP');
  });
});

describe('official WoW Forever locales', () => {
  it('covers all 15 locales exposed by Blizzard', () => {
    expect(locales).toHaveLength(15);
    expect(locales).toEqual(expect.arrayContaining([
      'zh', 'zh-tw', 'en', 'en-gb', 'de-de', 'es-es', 'es-mx', 'fr-fr',
      'it-it', 'ja-jp', 'ko-kr', 'pl-pl', 'pt-br', 'ru-ru', 'th-th',
    ]));
  });

  it('maps legacy short routes to Blizzard region URLs', () => {
    expect(officialForeverUrl('zh')).toContain('/zh-cn/forever');
    expect(officialForeverUrl('en')).toContain('/en-us/forever');
    expect(officialForeverUrl('es-mx')).toContain('/es-mx/forever');
  });
});
