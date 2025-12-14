import { PaginationAndSorting } from '../../../core/types/pagination-and-sorting';
import { PostSortFields } from './post-sort-fields';

export type PostQueryInput = PaginationAndSorting<PostSortFields> & {
  blogId?: string;
};
