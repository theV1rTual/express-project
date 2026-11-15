import { Request, Response } from 'express';
import { commentRepository } from '../../repository/comment.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { jwtService } from '../../../auth/adapters/jwt.service';

export async function getCommentByIdHandler(req: Request<{ id: string }>, res: Response) {

  const [scheme, token] = req.headers.authorization?.split(' ') ?? [];
  const payload = scheme === 'Bearer' && token
    ? await jwtService.verifyToken(token)
    : null;
  const viewerId = payload?.userId;

  const id = req.params.id;

  const comment = await commentRepository.findById(id, viewerId);

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
