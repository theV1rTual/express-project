import { Request, Response } from 'express';
import { PostInputDto } from '../../dto/post.input-dto';
import { postsRepository } from '../../repositories/posts.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';

export function updatePostHandler(
  req: Request<{ id: string }, {}, PostInputDto>,
  res: Response,
) {
  const id = req.params.id;
  const post = postsRepository.findById(id);

  if (!post) {
    res
      .status(HttpStatuses.NOT_FOUND)
      .send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));

    return;
  }

  postsRepository.update(id, req.body);
  res.sendStatus(HttpStatuses.NO_CONTENT);
}
