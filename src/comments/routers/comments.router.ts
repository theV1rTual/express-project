import { Router } from 'express';
import { getCommentByIdHandler } from './handlers/get-comment-by-id.handler';
import { deleteCommentHandler } from './handlers/delete-comment.handler';
import { accessTokenGuard } from '../../auth/guards/access.token.guard';
import { updateCommentHandler } from './handlers/update-comment.handler';
import { commentCreateInputValidation } from '../validation/comment.input-dto.validation-middlewares';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';

export const commentsRouter = Router({});

commentsRouter
  .get('/:id', getCommentByIdHandler)
  .put(
    '/:id',
    accessTokenGuard,
    commentCreateInputValidation,
    inputValidationResultMiddleware,
    updateCommentHandler,
  )
  .delete('/:id', accessTokenGuard, deleteCommentHandler);
