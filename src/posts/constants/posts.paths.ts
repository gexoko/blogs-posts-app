// Базовый путь модуля поездок (задаётся при подключении роутера в setup-app).
export const POSTS_PATH = '/ht_02/api/posts';

// Относительные под-маршруты внутри роутера поездок.
export const POSTS_ROUTES = {
  ROOT: '',
  BY_ID: '/:id',
} as const;
