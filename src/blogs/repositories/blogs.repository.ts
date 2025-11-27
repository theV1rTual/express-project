import { BlogViewModel } from '../types/BlogViewModel';
import { BlogInputDto } from '../dto/blog.input-dto';
import { blogsCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { BlogDbModel } from '../types/BlogDbModel';

export const blogsRepository = {
  async findAll(): Promise<WithId<BlogDbModel>[]> {
    return blogsCollection.find().toArray();
  },

  async findById(id: string): Promise<BlogDbModel | null> {
    return blogsCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newBlog: BlogInputDto): Promise<BlogViewModel> {
    const docToInsert: BlogDbModel = {
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
      _id: new ObjectId(),
    };

    const insertedResult = await blogsCollection.insertOne(docToInsert);

    return {
      id: insertedResult.insertedId.toString(),
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };
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
