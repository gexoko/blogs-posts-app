import request from 'supertest';
import { BLOGS_PATH } from '../../src/blogs/constants/blogs.paths';
import { POSTS_PATH } from '../../src/posts/constants/posts.paths';
import {
  createBlog,
  createTestApp,
  expectFieldErrors,
  getBlogDto,
  getPostDto,
} from '../utils/blogs-posts';
import { clearDb } from '../utils/clear-db';
import { generateBasicAuthToken } from '../utils/generate-admin-auth-token';

// Лимиты из текущих валидаторов проекта; при изменении ТЗ обновить эти случаи.
const resources = [
  {
    name: 'blogs',
    path: BLOGS_PATH,
    fields: ['name', 'description', 'websiteUrl'],
    limits: [
      { field: 'name', max: 15 },
      { field: 'description', max: 500 },
    ],
  },
  {
    name: 'posts',
    path: POSTS_PATH,
    fields: ['title', 'shortDescription', 'content', 'blogId'],
    limits: [
      { field: 'title', max: 30 },
      { field: 'shortDescription', max: 100 },
      { field: 'content', max: 100 },
    ],
  },
];

describe.each(resources)('$name validation', (resource) => {
  const app = createTestApp();
  const auth = generateBasicAuthToken();
  let data: Record<string, unknown>;

  beforeEach(async () => {
    await clearDb(app);
    data =
      resource.name === 'blogs'
        ? { ...getBlogDto() }
        : { ...getPostDto((await createBlog(app)).id) };
  });

  describe.each(['post', 'put'] as const)('%s', (method) => {
    let path: string;
    let initialList: unknown[];
    beforeEach(async () => {
      path = resource.path;
      if (method === 'put') {
        const created = await request(app)
          .post(resource.path)
          .set('Authorization', auth)
          .send(data)
          .expect(201);
        path += `/${created.body.id}`;
      }
      initialList = (await request(app).get(resource.path).expect(200)).body;
    });

    async function reject(body: Record<string, unknown>, fields: string[]) {
      const response = await request(app)
        [method](path)
        .set('Authorization', auth)
        .send(body)
        .expect(400);
      expectFieldErrors(response.body, fields);
      await request(app).get(resource.path).expect(200, initialList);
    }

    it('should report all missing fields', async () => {
      await reject({}, resource.fields);
    });

    describe.each(resource.fields)('%s', (field) => {
      it('should reject a missing field', async () => {
        const invalid = { ...data };
        delete invalid[field];
        await reject(invalid, [field]);
      });
      it.each([null, 123, true, {}, [], '', '   '])(
        'should reject %p',
        async (value) => {
          await reject({ ...data, [field]: value }, [field]);
        },
      );
    });

    describe.each(resource.limits)('$field length', ({ field, max }) => {
      it('should reject a value above the limit', async () => {
        await reject({ ...data, [field]: 'a'.repeat(max + 1) }, [field]);
      });
      it('should accept the maximum length', async () => {
        const response = await request(app)
          [method](path)
          .set('Authorization', auth)
          .send({ ...data, [field]: 'a'.repeat(max) })
          .expect(method === 'post' ? 201 : 204);
        const savedPath =
          method === 'post' ? `${resource.path}/${response.body.id}` : path;
        const saved = await request(app).get(savedPath).expect(200);
        expect(saved.body[field]).toBe('a'.repeat(max));
      });
    });

    if (resource.name === 'blogs') {
      it.each([
        'not-a-url',
        'http://example.com',
        `https://example.com/${'a'.repeat(82)}`,
      ])('should reject websiteUrl %s', async (websiteUrl) => {
        await reject({ ...data, websiteUrl }, ['websiteUrl']);
      });
      it('should accept a websiteUrl of 100 characters', async () => {
        const websiteUrl = `https://example.com/${'a'.repeat(80)}`;
        expect(websiteUrl).toHaveLength(100);
        await request(app)
          [method](path)
          .set('Authorization', auth)
          .send({ ...data, websiteUrl })
          .expect(method === 'post' ? 201 : 204);
      });
    } else {
      it('should reject a nonnumeric blogId', async () => {
        await reject({ ...data, blogId: 'abc' }, ['blogId']);
      });
    }
  });
});
