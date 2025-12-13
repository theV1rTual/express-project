import { SortDirection } from './sort-direction';

export type PaginationAndSorting<S> = {
  page: number;
  pageSize: number;
  sortBy: S;
  sortDirection: SortDirection;
};
