import { BlogViewModel } from './BlogViewModel';

export type BlogListPaginatedOutput = {
  items: BlogViewModel[];
  pagesCount: number;
  pageSize: number;
  totalCount: number;
  page: number;
};
