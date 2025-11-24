import { BlogInputDto } from '../../dto/blog.input-dto';
import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';

export async function updateBlogsHandler(
  req: Request<{ id: string }, {}, BlogInputDto>,
  res: Response,
) {
  const id = req.params.id;
  const blog = await blogsRepository.findById(id);

  if (!blog) {
    res
      .status(HttpStatuses.NOT_FOUND)
      .send([{ field: 'id', message: 'Blog not found' }]);

    return;
  }

  await blogsRepository.update(id, req.body);
  res.sendStatus(HttpStatuses.NO_CONTENT);
}
