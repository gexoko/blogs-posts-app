import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { blogsRepository } from '../../repositories/blogs.repository';
import { BlogInputModel } from '../../dto/BlogInputModel';

export function updateBlogHandler(
  req: Request<{ id: string }, {}, BlogInputModel>,
  res: Response,
) {
  // В репозиторий передаём атрибуты (доменные поля), а не весь JSON:API-конверт.
  const mappedBody = {
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  };

  const isUpdated = blogsRepository.update(+req.params.id, mappedBody);

  if (!isUpdated) {
    res
      .status(HttpStatus.NotFound)
      .send(
        createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
      );
    return;
  }

  res.sendStatus(HttpStatus.NoContent);
}
