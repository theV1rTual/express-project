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
import { postForBlogCreateInputValidation } from '../../posts/validation/post.input-dto-validation-middlewares';
import { createPostForBlogHandler } from './handlers/create-post-for-blog.handler';
import { PostSortFields } from '../../posts/routers/input /post-sort-fields';
import { container } from '../../composition-root';
import { PostController } from '../../posts/routers/handlers/posts.controller';

export const blogsRouter = Router({});

const postController = container.get(PostController)

blogsRouter
  .get('', paginationAndSortingValidation(BlogSortField), getBlogsListHandler)
  .post(
    '/:id/posts',
    superAdminGuardMiddleware,
    postForBlogCreateInputValidation,
    inputValidationResultMiddleware,
    createPostForBlogHandler,
  )
  .get(
    '/:id/posts',
    paginationAndSortingValidation(PostSortFields),
    postController.getPostsList.bind(postController),
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
