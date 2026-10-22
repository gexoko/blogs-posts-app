// Базовый путь модуля блогов (задаётся при подключении роутера в setup-app).
export const BLOGS_PATH = '/ht_02/api/blogs';

// Относительные под-маршруты внутри роутера блогов — чтобы не хардкодить строки.
export const BLOGS_ROUTES = {
  ROOT: '',
  BY_ID: '/:id',
} as const;
