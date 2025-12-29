import { Router } from 'express';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { UserSortField } from './input/user-sort-field';
import { getUsersListHandler } from './handlers/get-users-list.handler';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { createUserHandler } from './handlers/create-user.handler';
import { deleteUserHandler } from './handlers/delete-user.handler';
import { userCreateInputValidation } from '../validation/user.input-dto.validation-middlewares';

export const usersRouter = Router({});

usersRouter
  .get('', paginationAndSortingValidation(UserSortField), getUsersListHandler)
  .post(
    '/',
    superAdminGuardMiddleware,
    userCreateInputValidation,
    inputValidationResultMiddleware,
    createUserHandler,
  )
  .delete('/:id', superAdminGuardMiddleware, deleteUserHandler);
