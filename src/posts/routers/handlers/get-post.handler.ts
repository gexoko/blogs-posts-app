import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsRepository } from '../../repositories/posts.repository';
import { mapPostToResource } from '../mappers/map-post-to-output';

export async function getPostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const post = await postsRepository.findById(id);

    if (!post) {
      res.sendStatus(HttpStatus.NotFound);
      // .send(
      //   createErrorMessages([{ field: 'id', message: 'Post not found' }]),
      // );
      return;
    }
    const postViewModel = mapPostToResource(post);
    res.status(HttpStatus.Ok).send(postViewModel);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
