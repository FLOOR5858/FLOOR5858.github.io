import { defineConfig } from 'astro/config';

// 绑定自有域名后，把 site 改成 https://maomaoxiang.com（影响 canonical / hreflang / RSS 绝对链接）
export default defineConfig({
  site: 'https://maomaoxiang.com',
  i18n: {
    locales: ['zh-CN', 'en'],
    defaultLocale: 'zh-CN',
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    shikiConfig: { theme: 'github-dark', wrap: true },
  },
});
