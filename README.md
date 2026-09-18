# Forever Guide

面向《World of Warcraft: Forever》回归玩家的非官方中文决策工具。

![Forever Guide](public/logo.png)

## 核心页面

- `/`：回归玩家说明，以及 Forever、Modern、Classic 的关系
- `/beta/`：Beta 资格判断器
- `/editions/`：最低必要礼包选择器
- `/release-date/`：英文官网、台湾商店与中国大陆日期状态

页面信息核验于 2026-09-18。网站不会把官方排期窗口描述成已经验证的服务器实时状态，中国大陆日期在官方确认前保持为待定。

## 本地开发

需要 Node.js 22+ 和 pnpm 11。

```bash
pnpm install --frozen-lockfile
pnpm dev
```

默认访问地址：`http://localhost:4321/`

## 质量检查

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm check-links
pnpm check-config
```

## 部署

项目输出纯静态文件，可直接部署到 Cloudflare Pages：

- 构建命令：`pnpm build`
- 输出目录：`dist`
- Node.js：`22`

默认站点地址配置为 `https://wowforever-guide.pages.dev`，可在 `src/config/site.ts` 与 `wrangler.toml` 中修改。

## 声明

本站为非官方玩家工具，与 Blizzard Entertainment 无隶属或背书关系。World of Warcraft 及相关素材归其权利人所有。

基于 AnvilWiki 模板构建，代码按 [MIT License](LICENSE) 发布。
