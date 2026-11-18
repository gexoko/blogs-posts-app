import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { postsRepository } from '../../repositories/posts.repository';

export async function deletePostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  // Репозиторий вернёт false, если блог с таким id не найден.
  try {
    const id = req.params.id;
    const post = await postsRepository.findById(id);

    if (!post) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Post not found' }]),
        );
      return;
    }
    await postsRepository.delete(id);
    res.sendStatus(HttpStatus.NoContent);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
