import { BlogQueryInput } from '../routers/input/blog-query.input';
import { BlogDbModel } from '../types/BlogDbModel';
import { blogsRepository } from '../repositories/blogs.repository';

export const blogsService = {
  async findMany(
    queryDto: BlogQueryInput,
  ): Promise<{ items: BlogDbModel[]; totalCount: number }> {
    return blogsRepository.findAll(queryDto);
  },
};
