import request from 'supertest';
import { BLOGS_PATH } from '../../src/blogs/constants/blogs.paths';
import { POSTS_PATH } from '../../src/posts/constants/posts.paths';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../../src/settings/config';
import {
  createBlog,
  createTestApp,
  getBlogDto,
  getPostDto,
} from '../utils/blogs-posts';
import { clearDb } from '../utils/clear-db';
import { generateBasicAuthToken } from '../utils/generate-admin-auth-token';

const encode = (value: string) =>
  `Basic ${Buffer.from(value).toString('base64')}`;
const invalidAuth = [
  { label: 'missing header', header: undefined },
  { label: 'missing token', header: 'Basic' },
  { label: 'wrong scheme', header: 'Bearer token' },
  { label: 'missing colon', header: encode(ADMIN_USERNAME) },
  {
    label: 'wrong username',
    header: encode(`${ADMIN_USERNAME}-wrong:${ADMIN_PASSWORD}`),
  },
  {
    label: 'wrong password',
    header: encode(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}-wrong`),
  },
  {
    label: 'password with colon suffix',
    header: encode(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}:wrong`),
  },
];

describe.each([BLOGS_PATH, POSTS_PATH])(
  'Authentication for %s',
  (resourcePath) => {
    const app = createTestApp();
    let data: Record<string, unknown>;
    let existing: { id: string };

    beforeEach(async () => {
      await clearDb(app);
      data =
        resourcePath === BLOGS_PATH
          ? { ...getBlogDto() }
          : { ...getPostDto((await createBlog(app)).id) };
      const response = await request(app)
        .post(resourcePath)
        .set('Authorization', generateBasicAuthToken())
        .send(data)
        .expect(201);
      existing = response.body;
    });

    describe.each(['post', 'put', 'delete'] as const)('%s', (method) => {
      it.each(invalidAuth)(
        'should reject $label without modifying data',
        async ({ header }) => {
          const path =
            method === 'post' ? resourcePath : `${resourcePath}/${existing.id}`;
          const operation = request(app)[method](path);
          if (header !== undefined) operation.set('Authorization', header);
          await operation.send(data).expect(401);
          await request(app).get(resourcePath).expect(200, [existing]);
        },
      );
    });
  },
);
