import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapPostToResource } from '../mappers/map-post-to-output';
import { postsRepository } from '../../repositories/posts.repository';

export function getPostListHandler(req: Request, res: Response) {
  const posts = postsRepository.findAll();
  const mappedPosts = posts.map(mapPostToResource);
  res.status(HttpStatus.Ok).send(mappedPosts);
}
