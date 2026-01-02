import { Request, Response } from 'express';
import { commentRepository } from '../../repository/comment.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';

export async function deleteCommentHandler(req: Request, res: Response) {
  const id = req.params.id;
  const comment = commentRepository.findById(id);

  if (!comment) {
    res
      .status(HttpStatuses.NOT_FOUND)
      .send(
        createErrorMessages([{ field: 'id', message: 'comment not found' }]),
      );
    return;
  }

  const isDeleted = await commentRepository.delete(id);
  if (!isDeleted) {
    res.sendStatus(HttpStatuses.NOT_FOUND);
    return;
  }

  res.sendStatus(HttpStatuses.NO_CONTENT);
}
