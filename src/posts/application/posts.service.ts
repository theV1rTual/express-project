import { PostQueryInput } from '../routers/input /post-query.input';
import { PostDbModel } from '../types/PostDbModel';
import { postsRepository } from '../repositories/posts.repository';

export const postsService = {
  async findMany(
    queryDto: PostQueryInput,
  ): Promise<{ items: PostDbModel[]; totalCount: number }> {
    return postsRepository.findAll(queryDto);
  },
};
