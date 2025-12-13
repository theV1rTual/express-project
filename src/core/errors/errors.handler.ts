import { Response } from 'express';
import { RepositoryNotFoundError } from './repositoryNotFound.error';
import { HttpStatuses } from '../types/http-statuses';
import { createErrorMessages } from '../middlewares/validation/input-validation-result.middleware';
import { DomainError } from './domain.error';

export function errorsHandler(error: unknown, res: Response): void {
  if (error instanceof RepositoryNotFoundError) {
    const httpStatus = HttpStatuses.NOT_FOUND;

    res.status(httpStatus).send(
      createErrorMessages([
        {
          message: error.message,
          field: error.name,
        },
      ]),
    );

    return;
  }

  if (error instanceof DomainError) {
    const httpStatus = HttpStatuses.UNPROCESSABLE_ENTITY;

    res.status(httpStatus).send(
      createErrorMessages([
        {
          message: error.message,
          field: error.name,
        },
      ]),
    );

    return;
  }

  res.status(HttpStatuses.INTERNAL_SERVER_ERROR);
  return;
}
