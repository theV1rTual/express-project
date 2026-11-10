import { Router } from 'express';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
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
import { CommentSortField } from '../../comments/routers/input/comment-sort-field';
import { PostController } from './handlers/posts.controller';
import { container } from '../../composition-root';

export const postRouter = Router({});

const postController = container.get(PostController)

postRouter
  .get('', paginationAndSortingValidation(PostSortFields), postController.getPostsList.bind(postController))
  .get('/:id', postController.getPost.bind(postController))
  .post(
    '/',
    superAdminGuardMiddleware,
    postCreateInputValidation,
    inputValidationResultMiddleware,
    postController.createPost.bind(postController),
  )
  .put(
    '/:id',
    superAdminGuardMiddleware,
    postUpdateInputValidation,
    inputValidationResultMiddleware,
    postController.update.bind(postController),
  )
  .post(
    '/:postId/comments',
    accessTokenGuard,
    commentCreateInputValidation,
    inputValidationResultMiddleware,
    createCommentHandler,
  )
  .get(
    '/:postId/comments',
    paginationAndSortingValidation(CommentSortField),
    getCommentListHandler,
  )
  .delete('/:id', superAdminGuardMiddleware, postController.delete.bind(postController));
