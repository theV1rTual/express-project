import { PostQueryInput } from '../routers/input /post-query.input';
import { PostDbModel } from '../types/PostDbModel';
import { postsRepository } from '../repositories/posts.repository';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';

export const postsService = {
  async findMany(
    queryDto: PostQueryInput,
  ): Promise<{ items: PostDbModel[]; totalCount: number } | null> {
    if (queryDto.blogId) {
      const blog = await blogsRepository.findById(queryDto.blogId);
      if (!blog) {
        return null;
      }
    }
    return postsRepository.findAll(queryDto);
  },
};
