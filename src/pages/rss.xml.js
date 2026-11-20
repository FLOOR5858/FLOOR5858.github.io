import rss from '@astrojs/rss';
import { SITE } from '../consts';
import { getPostFamilies, postForLang } from '../lib/posts';

export async function GET(context) {
  const families = await getPostFamilies();
  const posts = families.map((fam) => postForLang(fam, 'zh-CN'));

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site,
    items: posts.map((post, i) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/articles/${families[i].key}/`,
    })),
  });
}
