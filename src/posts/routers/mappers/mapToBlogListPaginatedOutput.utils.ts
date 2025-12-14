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
    items: posts.map((post) => ({
      id: post._id.toString(),
      createdAt: post.createdAt,
      blogName: post.blogName,
      content: post.content,
      title: post.title,
      blogId: post.blogId,
      shortDescription: post.shortDescription,
    })),
    pageSize: meta.pageSize,
    page: meta.page,
    totalCount: meta.totalCount,
    pageCount: Math.ceil(meta.totalCount / meta.pageSize),
  };
}
