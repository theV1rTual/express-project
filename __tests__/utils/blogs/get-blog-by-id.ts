import { Express } from 'express';
import { BlogViewModel } from '../../../src/blogs/types/BlogViewModel';
import request from 'supertest';
import { routersPaths } from '../../../src/core/paths/paths';
import { generateAdminAuthToken } from '../generate-admin-auth-token';
import { HttpStatuses } from '../../../src/core/types/http-statuses';

export async function getBlogById(
  app: Express,
  blogId: string,
): Promise<BlogViewModel> {
  const blogResponse = await request(app)
    .get(`${routersPaths.blogs}/${blogId}`)
    .set('Authorization', generateAdminAuthToken())
    .expect(HttpStatuses.OK);

  return blogResponse.body;
}
