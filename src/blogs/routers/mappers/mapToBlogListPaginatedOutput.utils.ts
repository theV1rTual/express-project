import { BlogDbModel } from '../../types/BlogDbModel';
import { BlogListPaginatedOutput } from '../../types/BlogListPaginated.output';

export function mapToBlogListPaginatedOutput(
  blogs: BlogDbModel[],
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
  },
): BlogListPaginatedOutput {
  return {
    items: blogs.map((blog) => ({
      id: blog._id.toString(),
      isMembership: blog.isMembership,
      createdAt: blog.createdAt,
      websiteUrl: blog.websiteUrl,
      description: blog.description,
      name: blog.name,
    })),
    pageSize: meta.pageSize,
    page: meta.page,
    totalCount: meta.totalCount,
    pageCount: Math.ceil(meta.totalCount / meta.pageSize),
  };
}
