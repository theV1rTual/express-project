import { UserDbModel } from '../../types/UserDbModel';
import { UserListPaginatedOutput } from '../../types/UserListPaginated.output';

export function mapToUserListPaginatedOutput(
  users: UserDbModel[],
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
  },
): UserListPaginatedOutput {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.page,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: users.map((user: UserDbModel) => ({
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    })),
  };
}
