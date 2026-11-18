import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { PostInputModel } from '../../dto/PostInputModel';
import { postsRepository } from '../../repositories/posts.repository';
import { blogsRepository } from '../../../blogs/repositories/blogs.repository';

export async function updatePostHandler(
  req: Request<{ id: string }, {}, PostInputModel>,
  res: Response,
) {
  try {
    const blog = await blogsRepository.findById(req.body.blogId);

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
      blogId: blog._id,
      blogName: blog.name,
    };
    const mappedPostBody = { ...mappedBody };
    const isUpdated = await postsRepository.update(
      req.params.id,
      mappedPostBody,
    );

    if (!isUpdated) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Post not found' }]),
        );
      return;
    }
    res.sendStatus(HttpStatus.NoContent);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
