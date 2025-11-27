import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';

export async function deleteBlogHandler(req: Request, res: Response) {
  const id = req.params.id;
  const blog = blogsRepository.findById(id);

  if (!blog) {
    res
      .status(HttpStatuses.NOT_FOUND)
      .send(createErrorMessages([{ field: 'id', message: 'blog not found' }]));
    return;
  }

  const isDeleted = await blogsRepository.delete(id);
  if (!isDeleted) {
    res.sendStatus(404); // NOT_FOUND
    return;
  }

  res.sendStatus(204); // NO_CONTENT
}
