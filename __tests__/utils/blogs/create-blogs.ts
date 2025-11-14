import { Express } from 'express';
import { BlogInputDto } from '../../../src/blogs/dto/blog.input-dto';
import { Blog } from '../../../src/blogs/types/Blog';
import { getBlogDto } from './get-blog-dto';
import request from 'supertest';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { generateAdminAuthToken } from '../generate-admin-auth-token';
import { HttpStatuses } from '../../../src/core/types/http-statuses';

export async function createBlog(
  app: Express,
  blogDto?: BlogInputDto,
): Promise<Blog> {
  const testingBlogData = {
    ...getBlogDto(),
    id: 1,
    ...blogDto,
  };

  const createdBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set('Authorization', generateAdminAuthToken())
    .send(testingBlogData)
    .expect(HttpStatuses.CREATED);

  return createdBlogResponse.body;
}
