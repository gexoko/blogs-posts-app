import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapPostToResource } from '../mappers/map-post-to-output';
import { postsRepository } from '../../repositories/posts.repository';

export async function getPostListHandler(req: Request, res: Response) {
  try {
    const posts = await postsRepository.findAll();
    const mappedPosts = posts.map(mapPostToResource);
    res.status(HttpStatus.Ok).send(mappedPosts);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
