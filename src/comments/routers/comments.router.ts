import { Router } from 'express';
import { getCommentByIdHandler } from './handlers/get-comment-by-id.handler';
import { deleteCommentHandler } from './handlers/delete-comment.handler';
import { accessTokenGuard } from '../../auth/guards/access.token.guard';
import { updateCommentHandler } from './handlers/update-comment.handler';
import { commentCreateInputValidation } from '../validation/comment.input-dto.validation-middlewares';

export const commentsRouter = Router({});

commentsRouter
  .get('/:id', getCommentByIdHandler)
  .put(
    '/:id',
    accessTokenGuard,
    commentCreateInputValidation,
    updateCommentHandler,
  )
  .delete('/:id', accessTokenGuard, deleteCommentHandler);
