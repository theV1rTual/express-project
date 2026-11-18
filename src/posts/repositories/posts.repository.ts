import { PostViewModel } from '../types/PostViewModel';
import { PostInputDto } from '../dto/post.input-dto';
import { ObjectId } from 'mongodb';
import { mapPostDbToPostView } from '../routers/mappers/mapPostDbToPostView';
import { PostDbModel } from '../types/PostDbModel';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import { PostQueryInput } from '../routers/input /post-query.input';
import { injectable } from 'inversify';

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

    const items = await PostDbModel
      .find(filter)
      .sort({ [sortBy]: mongoSortDirection })
      .skip(skip)
      .limit(pageSize)

    const totalCount = await PostDbModel.countDocuments(filter);
    return { items, totalCount };
  }

  async findById(id: string): Promise<PostViewModel | null> {
    const postDb = await PostDbModel.findOne({ _id: new ObjectId(id) });
    if (!postDb) {
      return null;
    }
    return mapPostDbToPostView(postDb);
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
      likes: []
    };
    await PostDbModel.insertOne(docToInsert);
    return mapPostDbToPostView(docToInsert);
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
};
