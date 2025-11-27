import { PostViewModel } from '../types/PostViewModel';
import { PostInputDto } from '../dto/post.input-dto';
import { postsCollection } from '../../db/mongo.db';
import { ObjectId } from 'mongodb';
import { mapPostDbToPostView } from '../routers/mappers/mapPostDbToPostView';
import { PostDbModel } from '../types/PostDbModel';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';

export const postsRepository = {
  async findAll(): Promise<PostViewModel[]> {
    const posts = await postsCollection.find().toArray();
    return posts.map(mapPostDbToPostView);
  },

  async findById(id: string): Promise<PostViewModel | null> {
    const postDb = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!postDb) {
      return null;
    }
    return mapPostDbToPostView(postDb);
  },

  async create(newPost: PostInputDto): Promise<PostViewModel> {
    const blog = await blogsRepository.findById(newPost.blogId);

    const docToInsert: PostDbModel = {
      _id: new ObjectId(),
      createdAt: new Date().toISOString(),
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      title: newPost.title,
      blogId: newPost.blogId,
      blogName: blog?.name as string,
    };
    await postsCollection.insertOne(docToInsert);
    return mapPostDbToPostView(docToInsert);
  },

  async update(id: string, dto: PostInputDto): Promise<boolean> {
    const updatedResult = await postsCollection.updateOne(
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
  },

  async delete(id: string): Promise<boolean> {
    const deletedResult = await postsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return deletedResult.deletedCount === 1;
  },

  async clear(): Promise<void> {
    await postsCollection.deleteMany({});
  },
};
