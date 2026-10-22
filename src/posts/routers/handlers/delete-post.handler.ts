import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { postsRepository } from '../../repositories/posts.repository';

export function deletePostHandler(req: Request<{ id: string }>, res: Response) {
  // Репозиторий вернёт false, если блог с таким id не найден.
  const isDeleted = postsRepository.delete(+req.params.id);

  if (!isDeleted) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
    return;
  }

  res.sendStatus(HttpStatus.NoContent);
}
