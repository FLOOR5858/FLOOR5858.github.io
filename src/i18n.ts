export type Lang = 'zh-CN' | 'en';

export const DEFAULT_LANG: Lang = 'zh-CN';
export const LOCALES: Lang[] = ['zh-CN', 'en'];

export const LOCALE_NAMES: Record<Lang, string> = {
  'zh-CN': '中文',
  en: 'EN',
};

/** 统一在这里维护联系邮箱。 */
export const CONTACT_EMAIL = 'liu-h-bo@126.com';

type Dictionary = {
  siteName: string;
  tagline: string;
  description: string;
  navArticles: string;
  navRss: string;
  latestArticles: string;
  footerRights: string;
  footerNote: string;
  footerRss: string;
  aboutTitle: string;
  aboutHeading: string;
  aboutP1: string;
  aboutList: string[];
  aboutContact: string;
  emailLabel: string;
  articlesCount: (n: number) => string;
  noArticles: string;
  categoryDesc: (label: string) => string;
};

const dict: Record<Lang, Dictionary> = {
  'zh-CN': {
    siteName: '毛毛象实验室',
    tagline: '把复杂技术，写成能复现的工程笔记',
    description: '嵌入式、芯片、图传与工程实践的深度笔记。',
    navArticles: '文章',
    navRss: 'RSS',
    latestArticles: '最新文章',
    footerRights: '保留所有权利',
    footerNote: '部分文章首发于微信公众号，本站为完整归档 ·',
    footerRss: 'RSS 订阅',
    aboutTitle: '关于',
    aboutHeading: '关于这个站',
    aboutP1:
      '我在微信公众号写技术文章，但公众号的排版体系和检索能力都不适合做长期知识库。这个小站用来做三件事：',
    aboutList: [
      '把发出去的文章重新归档、结构化，方便自己回头查',
      '给外部留一个可被搜索引擎索引、可被自由引用的地址',
      '沉淀那些公众号里不好放的表格、公式、代码块和多图对比',
    ],
    aboutContact: '联系方式：在公众号后台留言，或直接发邮件到',
    emailLabel: '联系邮箱',
    articlesCount: (n) => `${n} 篇文章`,
    noArticles: '暂无文章。',
    categoryDesc: (label) => `${label} 分类下的全部技术文章`,
  },
  en: {
    siteName: 'Maomaoxiang Lab',
    tagline: 'Turning complex technology into reproducible engineering notes',
    description: 'In-depth notes on embedded systems, chips, video links, and hands-on engineering.',
    navArticles: 'Articles',
    navRss: 'RSS',
    latestArticles: 'Latest articles',
    footerRights: 'All rights reserved',
    footerNote: 'Some articles first appeared on WeChat. This site is the full archive -',
    footerRss: 'RSS feed',
    aboutTitle: 'About',
    aboutHeading: 'About this site',
    aboutP1:
      'I write technical articles on WeChat, but its layout and search are not built for a long-term knowledge base. This little site does three things:',
    aboutList: [
      'Re-archive published articles in a structured way so I can find them again',
      'Provide a stable, search-indexable URL that anyone can freely cite',
      'Host the tables, formulas, code blocks, and image comparisons that do not fit on WeChat',
    ],
    aboutContact: 'Get in touch: leave a message on the WeChat account, or email',
    emailLabel: 'Email',
    articlesCount: (n) => `${n} ${n === 1 ? 'article' : 'articles'}`,
    noArticles: 'No articles yet.',
    categoryDesc: (label) => `All technical articles in ${label}`,
  },
};

// aboutIntro 需要插入作者名，单独构造，避免字典里写死。
function withAuthor(lang: Lang, author: string): string {
  return lang === 'zh-CN'
    ? `这里是 ${author} 的技术笔记归档。`
    : `This is the technical notes archive of ${author}.`;
}

export function getDict(lang: Lang): Dictionary {
  return dict[lang] ?? dict[DEFAULT_LANG];
}

export function t(lang: Lang): Dictionary & { aboutIntro: string } {
  const d = getDict(lang);
  const author = lang === 'zh-CN' ? '毛毛象' : 'Maomaoxiang';
  return { ...d, aboutIntro: withAuthor(lang, author) };
}

export const CATEGORY_LABELS: Record<Lang, Record<string, string>> = {
  'zh-CN': {
    hardware: '硬件设计',
    chip: '芯片与器件',
    firmware: '固件与算法',
    tools: '工具与方法',
  },
  en: {
    hardware: 'Hardware',
    chip: 'Chips & Devices',
    firmware: 'Firmware & Algorithms',
    tools: 'Tools & Methods',
  },
};

export const CATEGORIES: Record<Lang, { key: string; label: string }[]> = {
  'zh-CN': Object.entries(CATEGORY_LABELS['zh-CN']).map(([key, label]) => ({ key, label })),
  en: Object.entries(CATEGORY_LABELS.en).map(([key, label]) => ({ key, label })),
};

/** 从 URL 路径推断语言：英文页面在 /en/ 前缀下。 */
export function langFromPath(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : DEFAULT_LANG;
}

/** 当前页面切换到另一种语言后的路径（保持同一内容页）。 */
export function alternatePath(pathname: string, target: Lang): string {
  const current = langFromPath(pathname);
  if (current === target) return pathname;
  let rest: string;
  if (current === 'en') {
    rest = pathname.replace(/^\/en/, '') || '/';
  } else {
    rest = pathname;
  }
  if (target === 'en') return `/en${rest === '/' ? '/' : rest}`;
  return rest === '/' ? '/' : rest;
}

/** 本地化日期格式。 */
export function formatDate(date: Date, lang: Lang): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return lang === 'zh-CN' ? `${y}年${m}月${d}日` : `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
