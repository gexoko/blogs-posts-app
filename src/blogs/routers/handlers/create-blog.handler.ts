import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsRepository } from '../../repositories/blogs.repository';
import { BlogInputModel } from '../../dto/BlogInputModel';
import { mapBlogToResource } from '../mappers/map-blog-to-output';

export async function createBlogHandler(
  req: Request<{}, {}, BlogInputModel>,
  res: Response,
) {
  // Тело уже проверено middleware-валидаторами. Данные лежат в body.
  try {
    const mappedBody = {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };

    const createdBlog = await blogsRepository.create(mappedBody);
    res.status(HttpStatus.Created).send(mapBlogToResource(createdBlog));
  } catch {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
