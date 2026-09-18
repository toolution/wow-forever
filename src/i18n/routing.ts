/**
 * i18n routing — the single source of truth for supported locales.
 *
 * 👉 APPLY TEMPLATE: When adding/removing a language, sync THREE places:
 *   1. Here — locales array
 *   2. src/locales/<locale>.json — actual file must exist (can be `{}` to start)
 *   3. src/content/wiki/<locale>/ — directory must exist (can be empty)
 *
 * URL strategy (as-needed prefix):
 *   - Simplified Chinese (default) has NO prefix: /beta/
 *   - Other locales ARE prefixed:                 /en/beta/
 *
 * This is configured in astro.config.ts via `i18n.routing.prefixDefaultLocale: false`.
 */

export const locales = ['zh', 'en'] as const;
// Keep a broader framework type for helpers and reusable template tests;
// `locales` remains the authoritative list of routes generated for this site.
export type Locale = 'zh' | 'en' | 'ja';

export const defaultLocale: Locale = 'zh';

/** English label for each locale (used in language switcher). */
export const LOCALE_LABELS: Record<Locale, string> = {
  zh: '简体中文',
  en: 'English',
  ja: '日本語',
};

/**
 * Open Graph wants og:locale in language_TERRITORY form (en_US, ja_JP) —
 * a bare ISO 639-1 code is technically invalid. Keyed loosely (not by
 * Locale) so new-locale.ts / apply-template.ts rewrites of the locales
 * array can't leave a type error behind, and landing-only locales (zh)
 * can be mapped too. Unknown locales fall back to the raw code at the
 * call site.
 */
export const OG_LOCALE_MAP: Record<string, string> = {
  zh: 'zh_CN',
  en: 'en_US',
};

/** Valid BCP 47 values for the document language. */
export const HTML_LANG_MAP: Record<Locale, string> = {
  zh: 'zh-CN',
  en: 'en',
  ja: 'ja',
};

/** Whether the given locale is the default (Simplified Chinese, no URL prefix). */
export function isDefaultLocale(locale: string): boolean {
  return locale === defaultLocale;
}

/** Type guard: narrow an arbitrary string to Locale. */
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
