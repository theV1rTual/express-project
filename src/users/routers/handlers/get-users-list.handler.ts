import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { UserQueryInput } from '../input/user-query.input';
import { setDefaultSortAndPagination } from '../../../core/helpers/set-default-sort-and-pagination';
import { userService } from '../../application/user.service';
import { mapToUserListPaginatedOutput } from '../mappers/mapToUserListPaginatedOutput.utils';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function getUsersListHandler(req: Request, res: Response) {
  try {
    const sanitizedQuery = matchedData<UserQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const queryInput = setDefaultSortAndPagination(sanitizedQuery);
    const { items, totalCount } = await userService.findMany(queryInput);

    const usersListOutput = mapToUserListPaginatedOutput(items, {
      page: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.send(usersListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
