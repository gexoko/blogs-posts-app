import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { PostInputModel } from '../../dto/PostInputModel';
import { postsRepository } from '../../repositories/posts.repository';
import { blogsRepository } from '../../../blogs/repositories/blogs.repository';

export function updatePostHandler(
  req: Request<{ id: string }, {}, PostInputModel>,
  res: Response,
) {
  const blog = blogsRepository.findById(+req.body.blogId);

  if (!blog) {
    res
      .status(HttpStatus.BadRequest)
      .send(
        createErrorMessages([{ field: 'blogId', message: 'Blog not found' }]),
      );
    return;
  }
  // В репозиторий передаём атрибуты (доменные поля), а не весь JSON:API-конверт.
  const mappedBody = {
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: +req.body.blogId,
    blogName: blog.name,
  };
  const mappedPostBody = { ...mappedBody };
  const isUpdated = postsRepository.update(+req.params.id, mappedPostBody);

  if (!isUpdated) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));
    return;
  }

  res.sendStatus(HttpStatus.NoContent);
}
