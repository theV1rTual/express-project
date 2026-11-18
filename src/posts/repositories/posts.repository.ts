import { PostViewModel } from '../types/PostViewModel';
import { PostInputDto } from '../dto/post.input-dto';
import { ObjectId } from 'mongodb';
import { mapPostDbToPostView } from '../routers/mappers/mapPostDbToPostView';
import { PostDbModel } from '../types/PostDbModel';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import { PostQueryInput } from '../routers/input /post-query.input';
import { injectable } from 'inversify';
import { LikeStatus } from '../types/like-status';

@injectable()
export class PostsRepository {
  async findAll(
    queryDto: PostQueryInput,
  ): Promise<{ items: PostDbModel[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, blogId } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};
    if (blogId) {
      filter.blogId = blogId;
    }

    const mongoSortDirection = sortDirection === 'asc' ? 1 : -1;

    const items = await PostDbModel.find(filter)
      .sort({ [sortBy]: mongoSortDirection })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await PostDbModel.countDocuments(filter);
    return { items, totalCount };
  }

  async findById(id: string, viewerId?: string): Promise<PostViewModel | null> {
    if (!ObjectId.isValid(id)) return null;
    const postDb = await PostDbModel.findOne({ _id: new ObjectId(id) });
    if (!postDb) {
      return null;
    }
    return mapPostDbToPostView(postDb, viewerId);
  }

  async create(newPost: PostInputDto): Promise<PostViewModel | null> {
    const blog = await blogsRepository.findById(newPost.blogId);

    if (!blog) {
      return null;
    }

    const docToInsert: PostDbModel = {
      _id: new ObjectId(),
      createdAt: new Date().toISOString(),
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      title: newPost.title,
      blogId: newPost.blogId,
      blogName: blog?.name as string,
      likes: [],
    };
    await PostDbModel.insertOne(docToInsert);
    return mapPostDbToPostView(docToInsert);
  }

  async updateLikeStatus(
    postId: string,
    userId: string,
    login: string,
    likeStatus: LikeStatus,
  ): Promise<boolean> {
    if (!ObjectId.isValid(postId)) return false;

    const reactions = { $ifNull: ['$likes', []] };
    const sameReaction = {
      $filter: {
        input: reactions,
        as: 'reaction',
        cond: {
          $and: [
            { $eq: ['$$reaction.userId', { $literal: userId }] },
            { $eq: ['$$reaction.status', { $literal: likeStatus }] },
          ],
        },
      },
    };
    const otherReactions = {
      $filter: {
        input: reactions,
        as: 'reaction',
        cond: { $ne: ['$$reaction.userId', { $literal: userId }] },
      },
    };
    const newReaction =
      likeStatus === 'None'
        ? []
        : [{ userId, login, status: likeStatus, addedAt: new Date() }];

    // A single document update avoids losing concurrent reactions.
    // An identical status preserves the original timestamp and newest-likes order.
    const result = await PostDbModel.updateOne(
      { _id: new ObjectId(postId) },
      [
        {
          $set: {
            likes: {
              $cond: [
                { $gt: [{ $size: sameReaction }, 0] },
                reactions,
                { $concatArrays: [otherReactions, { $literal: newReaction }] },
              ],
            },
          },
        },
      ],
      { updatePipeline: true },
    );
    return result.matchedCount === 1;
  }

  async update(id: string, dto: PostInputDto): Promise<boolean> {
    const updatedResult = await PostDbModel.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          title: dto.title,
          blogId: dto.blogId,
          content: dto.content,
          shortDescription: dto.shortDescription,
        },
      },
    );

    return updatedResult.matchedCount === 1;
  }

  async delete(id: string): Promise<boolean> {
    const deletedResult = await PostDbModel.deleteOne({
      _id: new ObjectId(id),
    });

    return deletedResult.deletedCount === 1;
  }

  async clear(): Promise<void> {
    await PostDbModel.deleteMany({});
  }
}
