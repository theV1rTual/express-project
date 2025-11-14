import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';

export function deleteBlogHandler(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const blog = blogsRepository.findById(id);

  if (!blog) {
    res
      .status(HttpStatuses.NOT_FOUND)
      .send(createErrorMessages([{ field: 'id', message: 'blog not found' }]));
    return;
  }

  blogsRepository.delete(id);
  res.sendStatus(HttpStatuses.NO_CONTENT);
}
