import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { PostInputModel } from '../../dto/PostInputModel';
import { postsRepository } from '../../repositories/posts.repository';
import { mapPostToResource } from '../mappers/map-post-to-output';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { blogsRepository } from '../../../blogs/repositories/blogs.repository';

export function createPostHandler(
  req: Request<{}, {}, PostInputModel>,
  res: Response,
) {
  // Тело уже проверено middleware-валидаторами. Данные лежат в body.

  // Поездку можно создать только для существующего водителя.
  const blog = blogsRepository.findById(+req.body.blogId);

  if (!blog) {
    res
      .status(HttpStatus.BadRequest)
      .send(
        createErrorMessages([{ field: 'blogId', message: 'Blog not found' }]),
      );
    return;
  }
  const mappedBody = {
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
  };
  // 3. Собираем полный объект для базы данных (добавляем blogName)
  const newPostData = {
    ...mappedBody,
    blogId: +blog.id,
    blogName: blog.name, // Берем имя из найденного блога
  };

  const createdPost = postsRepository.create(newPostData);
  res.status(HttpStatus.Created).send(mapPostToResource(createdPost));
}
