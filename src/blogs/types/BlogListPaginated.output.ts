import { BlogViewModel } from './BlogViewModel';

export type BlogListPaginatedOutput = {
  items: BlogViewModel[];
  pageCount: number;
  pageSize: number;
  totalCount: number;
  page: number;
};
