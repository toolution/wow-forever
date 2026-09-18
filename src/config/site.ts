/**
 * Site configuration — the single source of truth for game-specific metadata.
 *
 * 👉 APPLY TEMPLATE: Change every field here when building a new game wiki.
 * This is part of the CONFIG LAYER — framework code reads from here, never the reverse.
 */

export interface SiteConfig {
  /** Full site name, used in <title> suffix and Organization JSON-LD. e.g. "Anvil Quest Wiki" */
  name: string;
  /** Short name for PWA manifest, mobile logo, and the long-title <title> suffix (>50 chars). e.g. "AQ Wiki" */
  shortName: string;
  /** Site description for Organization JSON-LD and og:site_name. */
  description: string;
  /** Domain without protocol or trailing slash. e.g. "anvilquestwiki.wiki" */
  domain: string;
  /** Hero tagline shown under the site title. */
  tagline: string;
  /** Copyright / legal disclaimer line shown in footer. */
  legalNotice: string;
  /** BCP 47 language for this site's public content. */
  language: string;
  /**
   * Optional public contact email — rendered as a mailto link on the contact
   * page when set. AdSense reviewers look for a reachable contact channel;
   * if you run no social channels, set this.
   */
  contactEmail?: string;
  social: {
    /** Official game website URL (the game itself, not the wiki). */
    official: string;
    discord?: string;
    youtube?: string;
    twitter?: string;
    reddit?: string;
  };
  /**
   * Canonical URLs about the GAME (Steam page, official site, Wikipedia entry…).
   * Emitted as Organization JSON-LD `sameAs` — helps Google / AI engines link
   * this wiki to the game's knowledge-graph entity.
   */
  sameAs?: string[];
  game: {
    /** Full game name. */
    name: string;
    /** Platform: "Roblox" | "Steam" | "Epic Games" | "Mobile" | ... */
    platform: string;
    /** Developer / studio name. */
    developer: string;
    /** Genre description. */
    genre: string;
    /** ISO release date (optional). */
    releaseDate?: string;
  };
  /**
   * Dimensions of the default OG/Twitter share image (public/images/hero.webp).
   * Emitted as og:image:width / og:image:height so social crawlers can render
   * the share card without downloading the image first.
   */
  ogImageWidth: number;
  ogImageHeight: number;
  /** Default author name for articles without an explicit `author` in frontmatter (E-E-A-T signal). */
  defaultAuthor?: string;
}

export const site: SiteConfig = {
  name: 'Forever Guide',
  shortName: 'Forever',
  description:
    'A concise, unofficial decision guide for WoW Forever beta access, editions, regional dates, and returning players.',
  domain: 'wowforever-guide.pages.dev',
  tagline: '少买一档，也别错过关键日期',
  legalNotice:
    '本站为非官方玩家工具，与 Blizzard Entertainment 无隶属或背书关系。World of Warcraft 及相关素材归其权利人所有。',
  language: 'zh-CN',
  // 👉 APPLY TEMPLATE: set a real address if you run no social channels —
  // the contact page renders it as a mailto link.
  contactEmail: '',
  social: {
    official: 'https://worldofwarcraft.blizzard.com/zh-cn/forever',
    youtube: 'https://www.youtube.com/warcraft',
    twitter: 'https://x.com/Warcraft',
    reddit: 'https://www.reddit.com/r/wow/',
  },
  // 👉 APPLY TEMPLATE: point these at the game's real canonical pages.
  sameAs: [
    'https://worldofwarcraft.blizzard.com/zh-cn/forever',
    'https://shop.battle.net/product/world-of-warcraft-forever',
  ],
  game: {
    name: 'World of Warcraft: Forever',
    platform: 'Windows / macOS · Battle.net',
    developer: 'Blizzard Entertainment',
    genre: 'MMORPG',
    releaseDate: '2026-11-04',
  },
  // hero.webp is 1200×630 (the recommended OG share aspect ratio).
  ogImageWidth: 1200,
  ogImageHeight: 630,
};

/** Absolute site URL (no trailing slash). Falls back to the Astro `site` config. */
export const siteUrl: string = (process.env.SITE_URL || `https://${site.domain}`).replace(
  /\/$/,
  '',
);
