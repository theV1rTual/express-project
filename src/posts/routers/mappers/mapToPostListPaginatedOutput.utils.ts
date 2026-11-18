import { PostListPaginatedOutput } from '../../types/PostListPaginated.output';
import { PostDbModel } from '../../types/PostDbModel';
import { mapPostDbToPostView } from './mapPostDbToPostView';

export function mapToBlogListPaginatedOutput(
  posts: PostDbModel[],
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
  },
  viewerId?: string,
): PostListPaginatedOutput {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.page,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: posts.map((post) => mapPostDbToPostView(post, viewerId)),
  };
}
