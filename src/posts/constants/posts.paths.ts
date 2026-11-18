// Базовый путь модуля поездок (задаётся при подключении роутера в setup-app).
export const POSTS_PATH = '/hometask_03/api/posts';

// Относительные под-маршруты внутри роутера поездок.
export const POSTS_ROUTES = {
  ROOT: '',
  BY_ID: '/:id',
} as const;
