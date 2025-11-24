import { Blog } from '../types/Blog';
import { BlogInputDto } from '../dto/blog.input-dto';
import { blogsCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';

export const blogsRepository = {
  async findAll(): Promise<WithId<Blog>[]> {
    return blogsCollection.find().toArray();
  },

  async findById(id: string): Promise<WithId<Blog> | null> {
    return blogsCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newBlog: BlogInputDto): Promise<Blog> {
    const insertedResult = await blogsCollection.insertOne({
      createdAt: newBlog.createdAt,
      isMembership: newBlog.isMembership,
      description: newBlog.description,
      name: newBlog.name,
      websiteUrl: newBlog.websiteUrl,
      id: new ObjectId(),
    });
    return { ...newBlog, id: insertedResult.insertedId };
  },

  async update(id: string, dto: BlogInputDto): Promise<void> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      throw new Error('Blog not exists');
    }

    const updatedResult = await blogsCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      },
    );

    if (updatedResult.matchedCount < 1) {
      throw new Error('Blog not exists');
    }

    return;
  },

  async delete(id: string): Promise<void> {
    const deletedResult = await blogsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deletedResult.deletedCount < 1) {
      throw new Error('Blog not exists');
    }

    return;
  },

  async clear(): Promise<void> {
    await blogsCollection.deleteMany({});
  },
};
