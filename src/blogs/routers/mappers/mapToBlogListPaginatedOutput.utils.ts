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
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.page,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: blogs.map((blog) => ({
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    })),
  };
}
