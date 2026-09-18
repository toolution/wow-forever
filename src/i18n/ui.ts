/**
 * UI message loader — runtime bridge between locale JSON files and components.
 *
 * Responsibilities:
 *   - Load the messages object for a given locale.
 *   - deepMerge non-English locales over English, so missing keys fall back to English.
 *
 * Only manages UI text (nav labels, buttons, home content). Article body translation
 * is handled by src/i18n/content.ts (MDX file-based, per-article fallback).
 */

import zh from '~/locales/zh.json';
import enOverrides from './messages/en.json';

import { defaultLocale, type Locale } from './routing';

const localeModules = import.meta.glob('../locales/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, Record<string, unknown>>;

const messages = Object.fromEntries(
  Object.entries(localeModules).map(([file, value]) => [file.match(/\/([^/]+)\.json$/)?.[1], value]),
) as Partial<Record<Locale, Record<string, unknown>>>;

if (messages.en) {
  messages.en = deepMerge(messages.en, enOverrides as Record<string, unknown>);
}

/**
 * Deep-merge `source` over `base`. Arrays are replaced (not concatenated);
 * objects are merged recursively. Used to layer a partial translation over
 * the full English messages so missing keys transparently fall back.
 */
function deepMerge(
  base: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  if (typeof base !== 'object' || base === null) return source;
  if (typeof source !== 'object' || source === null) return base;
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      out[key] &&
      typeof out[key] === 'object' &&
      !Array.isArray(out[key])
    ) {
      out[key] = deepMerge(out[key] as Record<string, unknown>, value as Record<string, unknown>);
    } else {
      out[key] = value;
    }
  }
  return out;
}

/**
 * Get the full UI messages object for a locale, with English fallback.
 * Never throws — unknown locales return English.
 */
export function getUi(locale: string): typeof zh {
  if (locale === defaultLocale) return zh;
  const locMessages = isLocaleSafe(locale) ? (messages[locale] ?? {}) : {};
  return deepMerge(zh as Record<string, unknown>, locMessages) as typeof zh;
}

/** Translation function: t('nav.bosses') → localized string. */
export function t(locale: string, key: string): unknown {
  const ui = getUi(locale);
  return key
    .split('.')
    .reduce<unknown>(
      (acc, k) =>
        acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[k] : undefined,
      ui,
    );
}

function isLocaleSafe(value: string): value is Locale {
  return Object.hasOwn(messages, value);
}
