import { Request, Response } from 'express';
import { PostInputDto } from '../../dto/post.input-dto';
import { postsRepository } from '../../repositories/posts.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';

export async function updatePostHandler(
  req: Request<{ id: string }, {}, PostInputDto>,
  res: Response,
) {
  const id = req.params.id;
  const post = await postsRepository.findById(id);

  if (!post) {
    res
      .status(HttpStatuses.NOT_FOUND)
      .send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));

    return;
  }

  const isUpdated = await postsRepository.update(id, req.body);
  if (!isUpdated) {
    res.sendStatus(404);
    return;
  }

  res.sendStatus(204);
}
