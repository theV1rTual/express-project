import { Post } from '../types/Post';
import { PostInputDto } from '../dto/post.input-dto';
import { postsCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';

export const postsRepository = {
  async findAll(): Promise<WithId<Post>[]> {
    return postsCollection.find().toArray();
  },

  async findById(id: string): Promise<WithId<Post> | null> {
    return postsCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newPost: Post): Promise<WithId<Post>> {
    const insertedResult = await postsCollection.insertOne(newPost);
    return { ...newPost, _id: insertedResult.insertedId };
  },

  async update(id: string, dto: PostInputDto): Promise<void> {
    const post = await postsCollection.findOne({ _id: new ObjectId(id) });

    if (!post) {
      throw new Error('Post not exists');
    }

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

    if (updatedResult.matchedCount < 1) {
      throw new Error('Post not exists');
    }

    return;
  },

  async delete(id: string): Promise<void> {
    const deletedResult = await postsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deletedResult.deletedCount < 1) {
      throw new Error('Post not exists');
    }

    return;
  },

  async clear(): Promise<void> {
    await postsCollection.deleteMany({});
  },
};
