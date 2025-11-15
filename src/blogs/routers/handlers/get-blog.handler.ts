import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';

export function getBlogHandler(req: Request, res: Response) {
  const id = req.params.id;
  const blog = blogsRepository.findById(id);

  if (!blog) {
    res
      .status(HttpStatuses.NOT_FOUND)
      .send(
        createErrorMessages([{ field: 'id', message: 'Blog is not found' }]),
      );
    return;
  }

  res.status(HttpStatuses.OK).send(blog);
}
