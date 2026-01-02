import { Request, Response } from 'express';
import { commentRepository } from '../../repository/comment.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';

export async function updateCommentHandler(
  req: Request<{ id: string }, {}, { content: string }>,
  res: Response,
) {
  const id = req.params.id;
  const comment = await commentRepository.findById(id);

  if (!comment) {
    res
      .status(HttpStatuses.NOT_FOUND)
      .send([{ field: 'id', message: 'Comment not found' }]);

    return;
  }

  if (comment.commentatorInfo.userId !== req.user?.id) {
    res
      .status(HttpStatuses.FORBIDDEN)
      .send([{ field: 'content', message: 'No access to modify comments' }]);
  }

  const isUpdated = await commentRepository.update(id, req.body);

  if (!isUpdated) {
    res.sendStatus(HttpStatuses.NOT_FOUND);
    return;
  }

  res.sendStatus(HttpStatuses.NO_CONTENT);
}
