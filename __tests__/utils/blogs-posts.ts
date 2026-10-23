import express, { Express } from 'express';
import request from 'supertest';
import { setupApp } from '../../src/setup-app';
import { BLOGS_PATH } from '../../src/blogs/constants/blogs.paths';
import { POSTS_PATH } from '../../src/posts/constants/posts.paths';
import { BlogInputModel } from '../../src/blogs/dto/BlogInputModel';
import { BlogViewModel } from '../../src/blogs/dto/BlogViewModel';
import { PostInputModel } from '../../src/posts/dto/PostInputModel';
import { PostViewModel } from '../../src/posts/dto/PostViewModel';
import { generateBasicAuthToken } from './generate-admin-auth-token';

export const createTestApp = () => setupApp(express());

export const getBlogDto = (): BlogInputModel => ({
  name: 'Alpha',
  description: 'Alpha description',
  websiteUrl: 'https://example.com',
});

export const getPostDto = (blogId: string): PostInputModel => ({
  title: 'First post',
  shortDescription: 'Short description',
  content: 'Post content',
  blogId,
});

export async function createBlog(
  app: Express,
  data: BlogInputModel = getBlogDto(),
): Promise<BlogViewModel> {
  const response = await request(app)
    .post(BLOGS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(data)
    .expect(201);
  return response.body;
}

export async function createPost(
  app: Express,
  data: PostInputModel,
): Promise<PostViewModel> {
  const response = await request(app)
    .post(POSTS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(data)
    .expect(201);
  return response.body;
}

export function expectFieldErrors(body: unknown, fields: string[]) {
  expect(body).toEqual({
    errorsMessages: expect.arrayContaining(
      fields.map((field) => ({ field, message: expect.any(String) })),
    ),
  });
  expect((body as { errorsMessages: unknown[] }).errorsMessages).toHaveLength(
    fields.length,
  );
}
