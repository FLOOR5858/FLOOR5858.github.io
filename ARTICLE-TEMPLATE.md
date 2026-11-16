---
title: '在这里写文章标题'
description: '一句话摘要（60 字内），会显示在首页列表、RSS 和搜索引擎结果里。'
date: 2026-01-01
category: chip
tags: ['标签一', '标签二']
draft: true
---

> 这是文章模板。使用方法：
> 1. 复制本文件到 `src/content/articles/` 目录，文件名改成英文小写加连字符（如 `blc-notes.md`）
> 2. 填写上面 frontmatter 的五个字段，**把 draft 改成 false** 才会发布
> 3. 有图片就放到 `public/images/你的文件名/`，正文里用 `/images/你的文件名/图片.png` 引用
> 4. 三条命令发布：git add . → git commit -m "post: 标题" → git push
>
> category 只能填这四个值之一：hardware（硬件设计）/ chip（芯片与器件）/ firmware（固件与算法）/ tools（工具与方法）

## 一级小节写法

正文用普通 Markdown。代码块用三个反引号围起来并标注语言，会自动高亮：

```c
void example(void) { /* ... */ }
```

表格直接写 Markdown 表格：

| 列一 | 列二 |
| --- | --- |
| 内容 | 内容 |

引用用 > 开头；图片引用示例：

![说明文字](/images/blc-notes/example.png)
