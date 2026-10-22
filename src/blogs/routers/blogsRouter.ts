import { Router } from 'express';
import { getBlogListHandler } from './handlers/get-blog-list.handler';
import { getBlogHandler } from './handlers/get-blog.handler';
import { idValidation } from '../../core/middlewares/validation/params-id.validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard.middleware';
import { BLOGS_ROUTES } from '../constants/blogs.paths';
import { createBlogHandler } from './handlers/create-blog.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import {
  blogCreateInputValidation,
  blogUpdateInputValidation,
} from '../validation/blog.input-dto.validation-middlewares';

export const blogsRouter = Router({});

// Каждая цепочка: валидация -> проверка её результата -> handler.
// Пути маршрутов берём из констант модуля, а не из строковых литералов.
blogsRouter
  .get(BLOGS_ROUTES.ROOT, getBlogListHandler)

  .get(BLOGS_ROUTES.BY_ID, idValidation, getBlogHandler)

  .post(
    BLOGS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    blogCreateInputValidation,
    inputValidationResultMiddleware,
    createBlogHandler,
  )

  .put(
    BLOGS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idValidation,
    blogUpdateInputValidation,
    inputValidationResultMiddleware,
    updateBlogHandler,
  )

  .delete(
    BLOGS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteBlogHandler,
  );
