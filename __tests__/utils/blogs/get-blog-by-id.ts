import { Express } from 'express';
import { BlogViewModel } from '../../../src/blogs/types/BlogViewModel';
import request from 'supertest';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { generateAdminAuthToken } from '../generate-admin-auth-token';
import { HttpStatuses } from '../../../src/core/types/http-statuses';

export async function getBlogById(
  app: Express,
  blogId: string,
): Promise<BlogViewModel> {
  const blogResponse = await request(app)
    .get(`${BLOGS_PATH}/${blogId}`)
    .set('Authorization', generateAdminAuthToken())
    .expect(HttpStatuses.OK);

  return blogResponse.body;
}
