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
 *   - Other locales ARE prefixed:                 /en/beta/, /de-de/beta/
 *
 * This is configured in astro.config.ts via `i18n.routing.prefixDefaultLocale: false`.
 */

export const locales = [
  'zh',
  'zh-tw',
  'en',
  'en-gb',
  'de-de',
  'es-es',
  'es-mx',
  'fr-fr',
  'it-it',
  'ja-jp',
  'ko-kr',
  'pl-pl',
  'pt-br',
  'ru-ru',
  'th-th',
] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'zh';

/** English label for each locale (used in language switcher). */
export const LOCALE_LABELS: Record<Locale, string> = {
  zh: '简体中文',
  'zh-tw': '繁體中文',
  en: 'English (US)',
  'en-gb': 'English (UK)',
  'de-de': 'Deutsch',
  'es-es': 'Español (España)',
  'es-mx': 'Español (México)',
  'fr-fr': 'Français',
  'it-it': 'Italiano',
  'ja-jp': '日本語',
  'ko-kr': '한국어',
  'pl-pl': 'Polski',
  'pt-br': 'Português (Brasil)',
  'ru-ru': 'Русский',
  'th-th': 'ไทย',
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
  'zh-tw': 'zh_TW',
  en: 'en_US',
  'en-gb': 'en_GB',
  'de-de': 'de_DE',
  'es-es': 'es_ES',
  'es-mx': 'es_MX',
  'fr-fr': 'fr_FR',
  'it-it': 'it_IT',
  'ja-jp': 'ja_JP',
  'ko-kr': 'ko_KR',
  'pl-pl': 'pl_PL',
  'pt-br': 'pt_BR',
  'ru-ru': 'ru_RU',
  'th-th': 'th_TH',
};

/** Valid BCP 47 values for the document language. */
export const HTML_LANG_MAP: Record<Locale, string> = {
  zh: 'zh-CN',
  'zh-tw': 'zh-TW',
  en: 'en-US',
  'en-gb': 'en-GB',
  'de-de': 'de-DE',
  'es-es': 'es-ES',
  'es-mx': 'es-MX',
  'fr-fr': 'fr-FR',
  'it-it': 'it-IT',
  'ja-jp': 'ja-JP',
  'ko-kr': 'ko-KR',
  'pl-pl': 'pl-PL',
  'pt-br': 'pt-BR',
  'ru-ru': 'ru-RU',
  'th-th': 'th-TH',
};

/** SEO language tag for a route locale. Legacy short route keys stay standards-compliant. */
export function hreflangFor(locale: Locale): string {
  return HTML_LANG_MAP[locale];
}

/** Official Blizzard Forever page matching the visitor's locale. */
export function officialForeverUrl(locale: Locale): string {
  const officialLocale = locale === 'zh' ? 'zh-cn' : locale === 'en' ? 'en-us' : locale;
  return `https://worldofwarcraft.blizzard.com/${officialLocale}/forever`;
}

/** Whether the given locale is the default (Simplified Chinese, no URL prefix). */
export function isDefaultLocale(locale: string): boolean {
  return locale === defaultLocale;
}

/** Type guard: narrow an arbitrary string to Locale. */
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
