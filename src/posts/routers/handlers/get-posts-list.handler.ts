import { Response, Request } from 'express';
import { matchedData } from 'express-validator';
import { PostQueryInput } from '../input /post-query.input';
import { setDefaultSortAndPagination } from '../../../core/helpers/set-default-sort-and-pagination';
import { postsService } from '../../application/posts.service';
import { mapToBlogListPaginatedOutput } from '../mappers/mapToPostListPaginatedOutput.utils';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { HttpStatuses } from '../../../core/types/http-statuses';

export async function getPostsListHandler(req: Request, res: Response) {
  try {
    const sanitizedQuery = matchedData<PostQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const blogId = req.params.blogId;
    const queryInput = setDefaultSortAndPagination({
      ...sanitizedQuery,
      ...(blogId ? { blogId } : {}),
    });
    const result = await postsService.findMany(queryInput);
    if (!result) return res.sendStatus(HttpStatuses.NOT_FOUND);

    const postsListOutput = mapToBlogListPaginatedOutput(result.items, {
      page: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount: result.totalCount,
    });

    res.send(postsListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
