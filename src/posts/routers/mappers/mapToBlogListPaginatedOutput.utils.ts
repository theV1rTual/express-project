import { PostListPaginatedOutput } from '../../types/PostListPaginated.output';
import { PostDbModel } from '../../types/PostDbModel';

export function mapToBlogListPaginatedOutput(
  posts: PostDbModel[],
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
  },
): PostListPaginatedOutput {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.page,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: posts.map((post) => ({
      id: post._id.toString(),
      createdAt: post.createdAt,
      blogName: post.blogName,
      content: post.content,
      title: post.title,
      blogId: post.blogId,
      shortDescription: post.shortDescription,
    })),
  };
}
