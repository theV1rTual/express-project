import { PostViewModel } from './PostViewModel';

export type PostListPaginatedOutput = {
  items: PostViewModel[];
  pageCount: number;
  pageSize: number;
  totalCount: number;
  page: number;
};
