import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsRepository } from '../../repositories/blogs.repository';
import { mapBlogToResource } from '../mappers/map-blog-to-output';

export function getBlogListHandler(req: Request, res: Response) {
  const blogs = blogsRepository.findAll();
  const mappedBlogs = blogs.map(mapBlogToResource);
  res.status(HttpStatus.Ok).send(mappedBlogs);
}
