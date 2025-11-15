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

export const postRouter = Router({});

postRouter
  .get('', getPostsListHandler)
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
  .delete('/:id', superAdminGuardMiddleware, deletePostHandler);
