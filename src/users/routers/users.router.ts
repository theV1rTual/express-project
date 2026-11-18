import { Router } from 'express';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { UserSortField } from './input/user-sort-field';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { userCreateInputValidation } from '../validation/user.input-dto.validation-middlewares';
import { UsersController } from './handlers/users.controller';
import { container } from '../../composition-root';

export const usersRouter = Router({});

const usersController = container.get(UsersController)

usersRouter
  .get('', paginationAndSortingValidation(UserSortField), usersController.getUsers.bind(usersController))
  .post(
    '/',
    superAdminGuardMiddleware,
    userCreateInputValidation,
    inputValidationResultMiddleware,
    usersController.createUser.bind(usersController),
  )
  .delete('/:id', superAdminGuardMiddleware, usersController.deleteUser.bind(usersController));
