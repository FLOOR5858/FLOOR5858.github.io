import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(['hardware', 'chip', 'firmware', 'tools']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    lang: z.enum(['zh-CN', 'en']).default('zh-CN'),
    // 同一篇文章的不同语言版本共享一个 key，用于语言切换互跳
    translationKey: z.string().optional(),
  }),
});

export const collections = { articles };
