import { Router } from 'express';
import { getBlogsListHandler } from './handlers/get-blogs-list.handler';
import { getBlogHandler } from './handlers/get-blog.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import {
  blogCreateInputValidation,
  blogUpdateInputValidation,
} from '../validation/blog.input-dto.validation-middlewares';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { updateBlogsHandler } from './handlers/update-blogs.handler';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { BlogSortField } from './input/blog-sort-field';
import { postCreateInputValidation } from '../../posts/validation/post.input-dto-validation-middlewares';
import { createPostForBlogHandler } from './handlers/create-post-for-blog.handler';

export const blogsRouter = Router({});

blogsRouter
  .get('', paginationAndSortingValidation(BlogSortField), getBlogsListHandler)
  .post(
    '/:id/posts',
    superAdminGuardMiddleware,
    postCreateInputValidation,
    inputValidationResultMiddleware,
    createPostForBlogHandler,
  )
  .get('/:id', getBlogHandler)
  .post(
    '/',
    superAdminGuardMiddleware,
    blogCreateInputValidation,
    inputValidationResultMiddleware,
    createBlogHandler,
  )
  .put(
    '/:id',
    superAdminGuardMiddleware,
    blogUpdateInputValidation,
    inputValidationResultMiddleware,
    updateBlogsHandler,
  )
  .delete('/:id', superAdminGuardMiddleware, deleteBlogHandler);
