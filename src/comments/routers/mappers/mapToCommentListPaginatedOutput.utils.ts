import { CommentDbModel } from '../../types/CommentDbModel';
import { CommentListPaginatedOutput } from '../../types/CommentListPaginated.output';

export function mapToCommentListPaginatedOutput(
  comments: CommentDbModel[],
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
  },
): CommentListPaginatedOutput {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.page,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: comments.map((comment: CommentDbModel) => ({
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
    })),
  };
}
