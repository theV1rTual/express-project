import { CommentViewModel } from './CommentViewModel';

export type CommentListPaginatedOutput = {
  items: CommentViewModel[];
  pagesCount: number;
  pageSize: number;
  totalCount: number;
  page: number;
};
