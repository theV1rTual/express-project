import { PostQueryInput } from '../routers/input /post-query.input';
import { PostDbModel } from '../types/PostDbModel';
import { PostsRepository } from '../repositories/posts.repository';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import { inject, injectable } from 'inversify';
import { PostInputDto } from '../dto/post.input-dto';

@injectable()
export class PostsService {
  constructor(
    @inject(PostsRepository)
    private readonly postsRepository: PostsRepository
  ) { }

  async findMany(
    queryDto: PostQueryInput,
  ): Promise<{ items: PostDbModel[]; totalCount: number } | null> {
    if (queryDto.blogId) {
      const blog = await blogsRepository.findById(queryDto.blogId);
      if (!blog) {
        return null;
      }
    }
    return this.postsRepository.findAll(queryDto);
  }

  async findById(id: string) {
    return this.postsRepository.findById(id);
  }

  async create(newPost: PostInputDto) {
    return this.postsRepository.create(newPost);
  }

  async delete(id: string) {
    return this.postsRepository.delete(id)
  }

  async update(id: string, body: PostInputDto) {
    return this.postsRepository.update(id, body)
  }
};
