import { Request, Response } from 'express';
import { commentRepository } from '../../repository/comment.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';

export async function getCommentByIdHandler(req: Request, res: Response) {
  const id = req.params.id;

  const comment = await commentRepository.findById(id);

  if (!comment) {
    res
      .status(HttpStatuses.NOT_FOUND)
      .send(
        createErrorMessages([{ field: 'id', message: 'Comment not found' }]),
      );
    return;
  }

  res.status(HttpStatuses.OK).send(comment);
}
