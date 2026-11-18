import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsRepository } from '../../repositories/blogs.repository';
import { mapBlogToResource } from '../mappers/map-blog-to-output';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';

export async function getBlogHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const blog = await blogsRepository.findById(id);

    if (!blog) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
        );

      return;
    }

    const blogViewModel = mapBlogToResource(blog);
    res.status(HttpStatus.Ok).send(blogViewModel);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
