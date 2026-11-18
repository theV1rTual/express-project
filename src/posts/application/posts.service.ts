import { PostQueryInput } from '../routers/input /post-query.input';
import { PostDbModel } from '../types/PostDbModel';
import { PostsRepository } from '../repositories/posts.repository';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import { inject, injectable } from 'inversify';
import { PostInputDto } from '../dto/post.input-dto';
import { UsersRepository } from '../../users/infra/users.repository';
import { LikeStatus } from '../types/like-status';
import { ResultStatus } from '../../core/result /resultCode';
import { ObjectId } from 'mongodb';

@injectable()
export class PostsService {
  constructor(
    @inject(PostsRepository)
    private readonly postsRepository: PostsRepository,
    @inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

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

  async findById(id: string, viewerId?: string) {
    return this.postsRepository.findById(id, viewerId);
  }

  async updateLikeStatus(
    postId: string,
    userId: string,
    likeStatus: LikeStatus,
  ) {
    if (!ObjectId.isValid(userId)) return ResultStatus.Unauthorized;
    const user = await this.usersRepository.findById(userId);
    if (!user) return ResultStatus.Unauthorized;

    const updated = await this.postsRepository.updateLikeStatus(
      postId,
      userId,
      user.login,
      likeStatus,
    );
    return updated ? ResultStatus.Success : ResultStatus.NotFound;
  }

  async create(newPost: PostInputDto) {
    return this.postsRepository.create(newPost);
  }

  async delete(id: string) {
    return this.postsRepository.delete(id);
  }

  async update(id: string, body: PostInputDto) {
    return this.postsRepository.update(id, body);
  }
}
