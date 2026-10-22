import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsRepository } from '../../repositories/blogs.repository';
import { BlogInputModel } from '../../dto/BlogInputModel';
import { mapBlogToResource } from '../mappers/map-blog-to-output';

export function createBlogHandler(
  req: Request<{}, {}, BlogInputModel>,
  res: Response,
) {
  // Тело уже проверено middleware-валидаторами. Данные лежат в body.

  const mappedBody = {
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  };

  const createdBlog = blogsRepository.create(mappedBody);
  res.status(HttpStatus.Created).send(mapBlogToResource(createdBlog));
}
