import request from 'supertest';
import { POSTS_PATH } from '../../../src/posts/constants/posts.paths';
import { BlogViewModel } from '../../../src/blogs/dto/BlogViewModel';
import {
  createBlog,
  createPost,
  createTestApp,
  expectFieldErrors,
  getBlogDto,
  getPostDto,
} from '../../utils/blogs-posts';
import { clearDb } from '../../utils/clear-db';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';

describe('Posts API', () => {
  const app = createTestApp();
  const auth = generateBasicAuthToken();
  let blog: BlogViewModel;

  beforeEach(async () => {
    await clearDb(app);
    blog = await createBlog(app);
  });

  it('should create post with the name of its blog', async () => {
    const data = getPostDto(blog.id);
    const post = await createPost(app, data);
    expect(post).toEqual({
      ...data,
      id: expect.any(String),
      blogName: blog.name,
    });
    expect(post.id).not.toBe('');
    await request(app).get(`${POSTS_PATH}/${post.id}`).expect(200, post);
  });

  it('should return an empty posts list', async () => {
    await request(app).get(POSTS_PATH).expect(200, []);
  });

  it('should return all posts without authentication', async () => {
    const first = await createPost(app, getPostDto(blog.id));
    const second = await createPost(app, {
      ...getPostDto(blog.id),
      title: 'Second',
    });
    expect(first.id).not.toBe(second.id);
    const response = await request(app).get(POSTS_PATH).expect(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(expect.arrayContaining([first, second]));
    await request(app).get(`${POSTS_PATH}/${second.id}`).expect(200, second);
  });

  it('should update post fields and change both blogId and blogName', async () => {
    const post = await createPost(app, getPostDto(blog.id));
    const otherBlog = await createBlog(app, { ...getBlogDto(), name: 'Beta' });
    const data = {
      title: 'Updated title',
      shortDescription: 'Updated short description',
      content: 'Updated content',
      blogId: otherBlog.id,
    };
    await request(app)
      .put(`${POSTS_PATH}/${post.id}`)
      .set('Authorization', auth)
      .send(data)
      .expect(204);
    await request(app)
      .get(`${POSTS_PATH}/${post.id}`)
      .expect(200, { ...data, id: post.id, blogName: otherBlog.name });
  });

  it('should delete only the requested post', async () => {
    const first = await createPost(app, getPostDto(blog.id));
    const second = await createPost(app, getPostDto(blog.id));
    await request(app)
      .delete(`${POSTS_PATH}/${first.id}`)
      .set('Authorization', auth)
      .expect(204);
    await request(app).get(`${POSTS_PATH}/${first.id}`).expect(404);
    await request(app).get(POSTS_PATH).expect(200, [second]);
  });

  it.each(['get', 'put', 'delete'] as const)(
    'should return 404 for %s of a missing post',
    async (method) => {
      const existing = await createPost(app, getPostDto(blog.id));
      await request(app)
        [method](`${POSTS_PATH}/999999`)
        .set('Authorization', auth)
        .send(getPostDto(blog.id))
        .expect(404);
      await request(app).get(POSTS_PATH).expect(200, [existing]);
    },
  );

  it.each(['post', 'put'] as const)(
    'should reject a nonexistent blog on %s without changing posts',
    async (method) => {
      const existing = await createPost(app, getPostDto(blog.id));
      const path =
        method === 'post' ? POSTS_PATH : `${POSTS_PATH}/${existing.id}`;
      const response = await request(app)
        [method](path)
        .set('Authorization', auth)
        .send({ ...getPostDto('999999'), title: 'Must not save' })
        .expect(400);
      expectFieldErrors(response.body, ['blogId']);
      await request(app).get(POSTS_PATH).expect(200, [existing]);
    },
  );

  it('should ignore client id and blogName on creation and update', async () => {
    const data = getPostDto(blog.id);
    const response = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', auth)
      .send({ ...data, id: 777, blogName: 'Forged', extra: 'injected' })
      .expect(201);
    const post = response.body;
    expect(post).toEqual({
      ...data,
      id: expect.any(String),
      blogName: blog.name,
    });
    expect(post.id).not.toBe('777');
    await request(app)
      .put(`${POSTS_PATH}/${post.id}`)
      .set('Authorization', auth)
      .send({ ...data, title: 'Updated', id: 888, blogName: 'Forged' })
      .expect(204);
    await request(app)
      .get(`${POSTS_PATH}/${post.id}`)
      .expect(200, { ...post, title: 'Updated' });
    await request(app).get(`${POSTS_PATH}/888`).expect(404);
  });
});
