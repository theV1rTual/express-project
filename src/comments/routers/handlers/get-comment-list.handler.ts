import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { CommentQueryInput } from '../input/comment-query.input';
import { setDefaultSortAndPagination } from '../../../core/helpers/set-default-sort-and-pagination';
import { CommentsService } from '../../application/comments.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToCommentListPaginatedOutput } from '../mappers/mapToCommentListPaginatedOutput.utils';

export async function getCommentListHandler(req: Request, res: Response) {
  try {
    const postId = req.params.id;
    const sanitizedQuery = matchedData<CommentQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const queryInput = setDefaultSortAndPagination(sanitizedQuery);
    const { items, totalCount } = await CommentsService.findMany(
      queryInput,
      postId,
    );

    const commentsListOutput = mapToCommentListPaginatedOutput(items, {
      page: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.send(commentsListOutput);
  } catch (e) {
    errorsHandler(e, res);
  }
}
