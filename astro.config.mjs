import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://floor5858.github.io',
  markdown: {
    shikiConfig: { theme: 'github-dark', wrap: true },
  },
});
