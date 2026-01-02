import { Router } from 'express';
import { getPostsListHandler } from './handlers/get-posts-list.handler';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { createPostHandler } from './handlers/create-post.handler';
import { getPostHandler } from './handlers/get-post.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import {
  postCreateInputValidation,
  postUpdateInputValidation,
} from '../validation/post.input-dto-validation-middlewares';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { PostSortFields } from './input /post-sort-fields';
import { getCommentListHandler } from '../../comments/routers/handlers/get-comment-list.handler';
import { accessTokenGuard } from '../../auth/guards/access.token.guard';
import { commentCreateInputValidation } from '../../comments/validation/comment.input-dto.validation-middlewares';
import { createCommentHandler } from '../../comments/routers/handlers/create-comment.handler';

export const postRouter = Router({});

postRouter
  .get('', paginationAndSortingValidation(PostSortFields), getPostsListHandler)
  .get('/:id', getPostHandler)
  .post(
    '/',
    superAdminGuardMiddleware,
    postCreateInputValidation,
    inputValidationResultMiddleware,
    createPostHandler,
  )
  .put(
    '/:id',
    superAdminGuardMiddleware,
    postUpdateInputValidation,
    inputValidationResultMiddleware,
    updatePostHandler,
  )
  .post(
    '/:id/comments',
    accessTokenGuard,
    commentCreateInputValidation,
    inputValidationResultMiddleware,
    createCommentHandler,
  )
  .get('/:id/comments', getCommentListHandler)
  .delete('/:id', superAdminGuardMiddleware, deletePostHandler);
