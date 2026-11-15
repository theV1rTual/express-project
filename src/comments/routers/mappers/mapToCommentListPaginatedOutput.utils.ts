import { CommentDbModel } from '../../types/CommentDbModel';
import { CommentListPaginatedOutput } from '../../types/CommentListPaginated.output';
import { mapCommentDbToCommentView } from './mapCommentDbToCommentView';

export function mapToCommentListPaginatedOutput(
  comments: CommentDbModel[],
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
  },
  viewerId?: string
): CommentListPaginatedOutput {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.page,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: comments.map(comment => mapCommentDbToCommentView(comment, viewerId)),
  };
}
