import { Request, Response } from 'express';
import { BlogInputDto } from '../../dto/blog.input-dto';
import { BlogViewModel } from '../../types/BlogViewModel';
import { blogsRepository } from '../../repositories/blogs.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';

export async function createBlogHandler(
  req: Request<{}, {}, BlogInputDto>,
  res: Response,
) {
  const newBlog: BlogInputDto = {
    description: req.body.description,
    name: req.body.name,
    websiteUrl: req.body.websiteUrl,
  };

  let createdBlog: BlogViewModel = await blogsRepository.create(newBlog);
  res.status(HttpStatuses.CREATED).send(createdBlog);
}
