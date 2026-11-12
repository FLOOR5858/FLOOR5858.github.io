export const SITE = {
  name: '毛毛象实验室',
  tagline: '把复杂技术，写成能复现的工程笔记',
  description: '嵌入式、芯片、图传与工程实践的深度笔记。',
  author: '毛毛象',
};

export const CATEGORY_LABELS: Record<string, string> = {
  hardware: '硬件设计',
  chip: '芯片与器件',
  firmware: '固件与算法',
  tools: '工具与方法',
};

export const CATEGORIES = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
  key,
  label,
}));
