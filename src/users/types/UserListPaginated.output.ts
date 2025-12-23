import { UserViewModel } from './UserViewModel';

export type UserListPaginatedOutput = {
  items: UserViewModel[];
  pagesCount: number;
  pageSize: number;
  totalCount: number;
  page: number;
};
