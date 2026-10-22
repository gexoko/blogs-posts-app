import express, { Express, Request, Response } from 'express';
import { testingRouter } from './testing/routers/testing.router';
import { TESTING_PATH } from './testing/constants/testing.paths';
import { setupSwagger } from './core/swagger/setup-swagger';
import { HttpStatus } from './core/types/http-statuses';
import { blogsRouter } from './blogs/routers/blogsRouter';
import { BLOGS_PATH } from './blogs/constants/blogs.paths';
import { POSTS_PATH } from './posts/constants/posts.paths';
import { postsRouter } from './posts/routers/posts.router';

export const setupApp = (app: Express) => {
  // express.json() парсит JSON из тела запроса и кладёт его в req.body.
  app.use(express.json());

  // Health-check: простой ответ, что сервер жив.
  app.get('/', (req: Request, res: Response) => {
    res.status(HttpStatus.Ok).send('Hello world!');
  });

  // Каждый модуль подключается по своему базовому пути.
  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouter);
  app.use(TESTING_PATH, testingRouter);

  // Swagger UI с документацией API (доступно по /api).
  setupSwagger(app);

  return app;
};
