import { PostViewModel } from './PostViewModel';

export type PostListPaginatedOutput = {
  items: PostViewModel[];
  pagesCount: number;
  pageSize: number;
  totalCount: number;
  page: number;
};
