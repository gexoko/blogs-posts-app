import request from 'supertest';
import { BLOGS_PATH } from '../../../src/blogs/constants/blogs.paths';
import { createBlog, createTestApp, getBlogDto } from '../../utils/blogs-posts';
import { clearDb } from '../../utils/clear-db';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';

describe('Blogs API', () => {
  const app = createTestApp();
  const auth = generateBasicAuthToken();

  // Каждый тест начинает работу с пустой базой и не зависит от других тестов.
  beforeEach(async () => {
    await clearDb(app);
  });

  it('should create blog; POST /ht_02/api/blogs', async () => {
    const data = getBlogDto();
    const blog = await createBlog(app, data);
    expect(blog).toEqual({ ...data, id: expect.any(String) });
    expect(blog.id).not.toBe('');
    await request(app).get(`${BLOGS_PATH}/${blog.id}`).expect(200, blog);
  });

  it('should return an empty blogs list', async () => {
    await request(app).get(BLOGS_PATH).expect(200, []);
  });

  it('should return blogs list; GET /ht_02/api/blogs', async () => {
    const first = await createBlog(app);
    const second = await createBlog(app, { ...getBlogDto(), name: 'Beta' });
    expect(first.id).not.toBe(second.id);
    const response = await request(app).get(BLOGS_PATH).expect(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(expect.arrayContaining([first, second]));
  });

  it('should return the requested blog without authentication', async () => {
    await createBlog(app);
    const second = await createBlog(app, { ...getBlogDto(), name: 'Beta' });
    await request(app).get(`${BLOGS_PATH}/${second.id}`).expect(200, second);
  });

  it('should update blog and preserve its id', async () => {
    const blog = await createBlog(app);
    const data = {
      name: 'Updated',
      description: 'Updated description',
      websiteUrl: 'https://updated.com',
    };
    await request(app)
      .put(`${BLOGS_PATH}/${blog.id}`)
      .set('Authorization', auth)
      .send(data)
      .expect(204);
    await request(app)
      .get(`${BLOGS_PATH}/${blog.id}`)
      .expect(200, { ...data, id: blog.id });
  });

  it('should delete only the requested blog', async () => {
    const first = await createBlog(app);
    const second = await createBlog(app);
    await request(app)
      .delete(`${BLOGS_PATH}/${first.id}`)
      .set('Authorization', auth)
      .expect(204);
    await request(app).get(`${BLOGS_PATH}/${first.id}`).expect(404);
    await request(app).get(BLOGS_PATH).expect(200, [second]);
  });

  it.each(['get', 'put', 'delete'] as const)(
    'should return 404 for %s of a missing blog',
    async (method) => {
      const existing = await createBlog(app);
      await request(app)
        [method](`${BLOGS_PATH}/999999`)
        .set('Authorization', auth)
        .send(getBlogDto())
        .expect(404);
      await request(app).get(BLOGS_PATH).expect(200, [existing]);
    },
  );

  it('should ignore client id and extra fields on creation and update', async () => {
    const data = getBlogDto();
    const response = await request(app)
      .post(BLOGS_PATH)
      .set('Authorization', auth)
      .send({ ...data, id: 777, extra: 'injected' })
      .expect(201);
    const blog = response.body;
    expect(blog).toEqual({ ...data, id: expect.any(String) });
    expect(blog.id).not.toBe('777');
    await request(app)
      .put(`${BLOGS_PATH}/${blog.id}`)
      .set('Authorization', auth)
      .send({ ...data, name: 'Updated', id: 888, extra: 'injected' })
      .expect(204);
    await request(app)
      .get(`${BLOGS_PATH}/${blog.id}`)
      .expect(200, { ...blog, name: 'Updated' });
    await request(app).get(`${BLOGS_PATH}/888`).expect(404);
  });
});
