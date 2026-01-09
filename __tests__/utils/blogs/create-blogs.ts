import { Express } from 'express';
import { BlogInputDto } from '../../../src/blogs/dto/blog.input-dto';
import { BlogViewModel } from '../../../src/blogs/types/BlogViewModel';
import { getBlogDto } from './get-blog-dto';
import request from 'supertest';
import { routersPaths } from '../../../src/core/paths/paths';
import { generateAdminAuthToken } from '../generate-admin-auth-token';
import { HttpStatuses } from '../../../src/core/types/http-statuses';

export async function createBlog(
  app: Express,
  blogDto?: BlogInputDto,
): Promise<BlogViewModel> {
  const testingBlogData = {
    ...getBlogDto(),
    id: 1,
    ...blogDto,
  };

  const createdBlogResponse = await request(app)
    .post(routersPaths.blogs)
    .set('Authorization', generateAdminAuthToken())
    .send(testingBlogData)
    .expect(HttpStatuses.CREATED);

  return createdBlogResponse.body;
}
