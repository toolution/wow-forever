import type { APIRoute } from 'astro';
import { site, siteUrl } from '~/config/site';

export const GET: APIRoute = () => {
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    '这是一个面向回归玩家的非官方 WoW Forever 决策工具。',
    '',
    '## 核心页面',
    '',
    `- [回归玩家说明](${siteUrl}/): 快速理解 Forever 与订阅、Modern、Classic 的关系。`,
    `- [Beta 资格判断](${siteUrl}/beta/): 区分报名机会、礼包权益与不包含 Beta 的版本。`,
    `- [礼包选择器](${siteUrl}/editions/): 按实际需求判断最低必要礼包。`,
    `- [地区日期工具](${siteUrl}/release-date/): 分开显示英文官网、台湾商店与中国大陆待确认状态。`,
    '',
    '信息核验日期：2026-09-18。本站未验证 Beta 服务器的实时开放状态。',
  ];

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
