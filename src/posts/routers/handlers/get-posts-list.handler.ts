import { Response, Request } from 'express';
import { matchedData } from 'express-validator';
import { PostQueryInput } from '../input /post-query.input';
import { setDefaultSortAndPagination } from '../../../core/helpers/set-default-sort-and-pagination';
import { postsService } from '../../application/posts.service';
import { mapToBlogListPaginatedOutput } from '../mappers/mapToPostListPaginatedOutput.utils';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function getPostsListHandler(req: Request, res: Response) {
  try {
    const sanitizedQuery = matchedData<PostQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });
    const queryInput = setDefaultSortAndPagination(sanitizedQuery);
    const { items, totalCount } = await postsService.findMany(queryInput);

    const postsListOutput = mapToBlogListPaginatedOutput(items, {
      page: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.send(postsListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
