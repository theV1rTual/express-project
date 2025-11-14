import { Request, Response } from 'express';
import { BlogInputDto } from '../../dto/blog.input-dto';
import { Blog } from '../../types/Blog';
import { db } from '../../../db/in-memory.db';
import { blogsRepository } from '../../repositories/blogs.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';

export function createBlogHandler(
  req: Request<{}, {}, BlogInputDto>,
  res: Response,
) {
  const newBlog: Blog = {
    id: db.blogs.length ? db.blogs[db.blogs.length - 1].id + 1 : 1,
    description: req.body.description,
    name: req.body.name,
    websiteUrl: req.body.websiteUrl,
  };

  blogsRepository.create(newBlog);
  res.status(HttpStatuses.CREATED).send(newBlog);
}
