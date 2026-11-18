import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsRepository } from '../../repositories/blogs.repository';
import { mapBlogToResource } from '../mappers/map-blog-to-output';

export async function getBlogListHandler(req: Request, res: Response) {
  try {
    const blogs = await blogsRepository.findAll();
    const mappedBlogs = blogs.map(mapBlogToResource);
    res.status(HttpStatus.Ok).send(mappedBlogs);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
