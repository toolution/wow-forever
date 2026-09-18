import { defaultLocale, locales, type Locale } from '~/i18n/routing';

export const LOCALE_STORAGE_KEY = 'forever-locale';

/**
 * Ordered from region/script-specific matches to language-wide fallbacks.
 * A rule matches either the complete browser tag or a longer tag beginning
 * with `${prefix}-` (for example zh-Hant-TW matches zh-hant).
 */
export const BROWSER_LOCALE_RULES: ReadonlyArray<{
  prefixes: readonly string[];
  locale: Locale;
}> = [
  { prefixes: ['zh-hant', 'zh-tw', 'zh-hk', 'zh-mo'], locale: 'zh-tw' },
  { prefixes: ['en-gb', 'en-ie', 'en-au', 'en-nz'], locale: 'en-gb' },
  { prefixes: ['es-mx'], locale: 'es-mx' },
  { prefixes: ['zh'], locale: 'zh' },
  { prefixes: ['en'], locale: 'en' },
  { prefixes: ['de'], locale: 'de-de' },
  { prefixes: ['es'], locale: 'es-es' },
  { prefixes: ['fr'], locale: 'fr-fr' },
  { prefixes: ['it'], locale: 'it-it' },
  { prefixes: ['ja'], locale: 'ja-jp' },
  { prefixes: ['ko'], locale: 'ko-kr' },
  { prefixes: ['pl'], locale: 'pl-pl' },
  { prefixes: ['pt'], locale: 'pt-br' },
  { prefixes: ['ru'], locale: 'ru-ru' },
  { prefixes: ['th'], locale: 'th-th' },
];

/** Resolve navigator.languages to the closest locale available for a page. */
export function matchBrowserLocale(
  languages: readonly string[],
  availableLocales: readonly Locale[] = locales,
): Locale {
  const available = new Set<Locale>(availableLocales);

  for (const language of languages) {
    const normalized = language.trim().toLowerCase().replaceAll('_', '-');
    if (!normalized) continue;

    for (const rule of BROWSER_LOCALE_RULES) {
      const matches = rule.prefixes.some(
        (prefix) => normalized === prefix || normalized.startsWith(`${prefix}-`),
      );
      if (matches && available.has(rule.locale)) return rule.locale;
    }
  }

  return available.has(defaultLocale) ? defaultLocale : (availableLocales[0] ?? defaultLocale);
}
