import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsRepository } from '../../repositories/posts.repository';
import { mapPostToResource } from '../mappers/map-post-to-output';

export function getPostHandler(req: Request<{ id: string }>, res: Response) {
  const post = postsRepository.findById(+req.params.id);

  if (!post) {
    res.sendStatus(HttpStatus.NotFound);
    // .send(
    //   createErrorMessages([{ field: 'id', message: 'Post not found' }]),
    // );
    return;
  }

  res.status(HttpStatus.Ok).send(mapPostToResource(post));
}
