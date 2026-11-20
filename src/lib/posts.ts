import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

export type Post = CollectionEntry<'articles'>;

export interface PostFamily {
  key: string;
  zh?: Post;
  en?: Post;
  latest: Date;
}

/**
 * 把中英文文章按 translationKey 配成"文章族"。
 * 没有 translationKey 的文章按自身 id 成族（只有单一语言）。
 * 这样两种语言共享同一个 URL slug，语言切换器可以直接互跳。
 */
export async function getPostFamilies(): Promise<PostFamily[]> {
  const posts = await getCollection('articles', ({ data }) => !data.draft);
  const map = new Map<string, PostFamily>();

  for (const p of posts) {
    const key = p.data.translationKey ?? p.id.replace(/\.en$/, '');
    if (!map.has(key)) map.set(key, { key, latest: p.data.date });
    const fam = map.get(key)!;
    if (p.data.lang === 'en') fam.en = p;
    else fam.zh = p;
    if (p.data.date.valueOf() > fam.latest.valueOf()) fam.latest = p.data.date;
  }

  return [...map.values()].sort((a, b) => b.latest.valueOf() - a.latest.valueOf());
}

/** 取某个语言版本的文章；该语言没有译文时回退到中文版（或英文版）。 */
export function postForLang(fam: PostFamily, lang: Lang): Post {
  if (lang === 'en') return fam.en ?? fam.zh!;
  return fam.zh ?? fam.en!;
}

/** 判断某语言是否有对应译文（用于标注 Chinese only）。 */
export function hasTranslation(fam: PostFamily, lang: Lang): boolean {
  return lang === 'en' ? !!fam.en : !!fam.zh;
}

/** 文章在该语言下的 URL。 */
export function postUrl(fam: PostFamily, lang: Lang): string {
  const base = `/articles/${fam.key}/`;
  return lang === 'en' ? `/en${base}` : base;
}

/** 文章族的分类（中英文应一致，取任一存在的版本）。 */
export function familyCategory(fam: PostFamily): string {
  return (fam.zh ?? fam.en)!.data.category;
}
