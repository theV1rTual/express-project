import { Express } from 'express';
import { BlogInputDto } from '../../../src/blogs/dto/blog.input-dto';
import request from 'supertest';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { generateAdminAuthToken } from '../generate-admin-auth-token';
import { HttpStatuses } from '../../../src/core/types/http-statuses';
import { getBlogDto } from './get-blog-dto';

export async function updateBlog(
  app: Express,
  blogId: number,
  blogDto?: BlogInputDto,
): Promise<void> {
  const testBlogData: BlogInputDto = {
    ...getBlogDto(),
    ...blogDto,
  };

  const updatedBlogResponse = await request(app)
    .put(`${BLOGS_PATH}/${blogId}`)
    .set('Authorization', generateAdminAuthToken())
    .send(testBlogData)
    .expect(HttpStatuses.NO_CONTENT);

  return updatedBlogResponse.body;
}
