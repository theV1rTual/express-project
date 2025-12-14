import { Request, Response } from 'express';
import { setDefaultSortAndPagination } from '../../../core/helpers/set-default-sort-and-pagination';
import { matchedData } from 'express-validator';
import { BlogQueryInput } from '../input/blog-query.input';
import { blogsService } from '../../application/blogs.service';
import { mapToBlogListPaginatedOutput } from '../mappers/mapToBlogListPaginatedOutput.utils';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function getBlogsListHandler(req: Request, res: Response) {
  try {
    const sanitizedQuery = matchedData<BlogQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });
    const queryInput = setDefaultSortAndPagination(sanitizedQuery);
    const { items, totalCount } = await blogsService.findMany(queryInput);

    const blogsListOutput = mapToBlogListPaginatedOutput(items, {
      page: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.send(blogsListOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
