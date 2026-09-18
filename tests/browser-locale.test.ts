import { describe, expect, it } from 'vitest';
import { matchBrowserLocale } from '~/lib/browser-locale';

describe('browser locale matching', () => {
  it.each([
    [['zh-TW'], 'zh-tw'],
    [['zh-HK'], 'zh-tw'],
    [['zh-Hant-TW'], 'zh-tw'],
    [['zh-CN'], 'zh'],
    [['en-GB'], 'en-gb'],
    [['en-IE'], 'en-gb'],
    [['en-US'], 'en'],
    [['es-MX'], 'es-mx'],
    [['es-AR'], 'es-es'],
    [['pt-PT'], 'pt-br'],
    [['de-AT'], 'de-de'],
    [['fr-CA'], 'fr-fr'],
    [['it-CH'], 'it-it'],
    [['ja'], 'ja-jp'],
    [['ko'], 'ko-kr'],
    [['pl'], 'pl-pl'],
    [['ru'], 'ru-ru'],
    [['th'], 'th-th'],
  ] as const)('maps %j to %s', (languages, expected) => {
    expect(matchBrowserLocale(languages)).toBe(expected);
  });

  it('checks browser preferences in order and ignores unsupported languages', () => {
    expect(matchBrowserLocale(['xx-YY', 'fr-CA', 'en-US'])).toBe('fr-fr');
  });

  it('falls back from a regional locale to an available language variant', () => {
    expect(matchBrowserLocale(['en-GB'], ['zh', 'en'])).toBe('en');
    expect(matchBrowserLocale(['es-MX'], ['zh', 'es-es'])).toBe('es-es');
  });

  it('returns simplified Chinese when no browser language is supported', () => {
    expect(matchBrowserLocale(['xx-YY'])).toBe('zh');
  });

  it('falls back to the first available locale when the default is unavailable', () => {
    expect(matchBrowserLocale(['xx-YY'], ['ja-jp'])).toBe('ja-jp');
  });
});
