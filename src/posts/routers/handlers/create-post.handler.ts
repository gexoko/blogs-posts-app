import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { PostInputModel } from '../../dto/PostInputModel';
import { postsRepository } from '../../repositories/posts.repository';
import { mapPostToResource } from '../mappers/map-post-to-output';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { blogsRepository } from '../../../blogs/repositories/blogs.repository';

export async function createPostHandler(
  req: Request<{}, {}, PostInputModel>,
  res: Response,
) {
  try {
    const blog = await blogsRepository.findById(req.body.blogId);

    if (!blog) {
      res
        .status(HttpStatus.BadRequest)
        .send(
          createErrorMessages([{ field: 'blogId', message: 'Blog not found' }]),
        );
      return;
    }
    const mappedBody = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
      createdAt: new Date(),
    };
    // 3. Собираем полный объект для базы данных (добавляем blogName)
    const newPostData = {
      ...mappedBody,
      blogId: blog._id,
      blogName: blog.name, // Берем имя из найденного блога
    };

    const createdPost = await postsRepository.create(newPostData);
    const postViewModel = mapPostToResource(createdPost);
    res.status(HttpStatus.Created).send(postViewModel);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
