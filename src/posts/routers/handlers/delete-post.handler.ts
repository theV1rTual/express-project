import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';

export function deletePostHandler(req: Request, res: Response) {
  const id = req.params.id;
  const post = postsRepository.findById(id);

  if (!post) {
    res
      .status(HttpStatuses.NOT_FOUND)
      .send(createErrorMessages([{ field: 'id', message: 'Post not exists' }]));
    return;
  }

  postsRepository.delete(id);
  res.sendStatus(HttpStatuses.NO_CONTENT);
}
