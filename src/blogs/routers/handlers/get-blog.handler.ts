import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsRepository } from '../../repositories/blogs.repository';
import { mapBlogToResource } from '../mappers/map-blog-to-output';

export function getBlogHandler(req: Request<{ id: string }>, res: Response) {
  const blog = blogsRepository.findById(+req.params.id);

  if (!blog) {
    res.sendStatus(HttpStatus.NotFound);
    // .send(
    //   createErrorMessages([{ field: 'id', message: 'Blog not found' }]),
    // );
    return;
  }

  res.status(HttpStatus.Ok).send(mapBlogToResource(blog));
}
