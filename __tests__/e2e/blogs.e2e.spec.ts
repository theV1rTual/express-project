import express from 'express';
import { setupApp } from '../../src/setup-app';
import request from 'supertest';
import { generateAdminAuthToken } from '../utils/generate-admin-auth-token';
import { HttpStatuses } from '../../src/core/types/http-statuses';
import { createBlog } from '../utils/blogs/create-blogs';
import { BlogInputDto } from '../../src/blogs/dto/blog.input-dto';
import { BLOGS_PATH, TESTING_PATH } from '../../src/core/paths/paths';
import { getBlogById } from '../utils/blogs/get-blog-by-id';
import { updateBlog } from '../utils/blogs/update-blog';

describe('Blog API', function () {
  const app = express();
  setupApp(app);

  const testBlogData: BlogInputDto = {
    description: 'test description',
    name: 'test blog',
    websiteUrl: 'test websiteUrl',
  };

  const adminToken = generateAdminAuthToken();

  beforeAll(async () => {
    await request(app).delete(TESTING_PATH).expect(HttpStatuses.NO_CONTENT);
  });

  it('should create blog; POST /api/blogs', async () => {
    await createBlog(app, {
      ...testBlogData,
      name: 'Salam',
    });
  });

  it('should return blogs list; GET /api/blogs', async () => {
    await createBlog(app);
    await createBlog(app);

    const blogsListResponse = await request(app)
      .get(BLOGS_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatuses.OK);

    expect(blogsListResponse.body).toBeInstanceOf(Array);
    expect(blogsListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  it('should return driver by id; GET /api/blogs/:id', async () => {
    const createdResponse = await createBlog(app);

    const blog = await getBlogById(app, createdResponse.id);

    expect(blog).toEqual(createdResponse);
  });

  it('should update blog; PUT /api/blogs/:id', async () => {
    const createdCResponse = await createBlog(app);

    const blogUpdateData: BlogInputDto = {
      name: 'updated blog data',
      description: 'updated blog description',
      websiteUrl: 'updated blog websiteUrl',
    };

    await updateBlog(app, createdCResponse.id, blogUpdateData);

    const blogResponse = await getBlogById(app, createdCResponse.id);
    expect(blogResponse).toEqual({
      ...createdCResponse,
      ...blogUpdateData,
    });
  });
});
