import { BlogViewModel } from '../types/BlogViewModel';
import { BlogInputDto } from '../dto/blog.input-dto';
import { blogsCollection } from '../../db/mongo.db';
import { ObjectId } from 'mongodb';
import { BlogDbModel } from '../types/BlogDbModel';
import { mapBlogDbToViewModel } from '../routers/mappers/mapBlogDbToBlogView';
import { BlogQueryInput } from '../routers/input/blog-query.input';

export const blogsRepository = {
  async findAll(
    queryDto: BlogQueryInput,
  ): Promise<{ items: BlogDbModel[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }

    const mongoSortDirection = sortDirection === 'asc' ? 1 : -1;

    const items = await blogsCollection
      .find(filter)
      .sort({ [sortBy]: mongoSortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();
    const totalCount = await blogsCollection.countDocuments(filter);

    return { items, totalCount };
  },

  async findById(id: string): Promise<BlogViewModel | null> {
    const blogDb = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!blogDb) return null;

    return mapBlogDbToViewModel(blogDb);
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

    await blogsCollection.insertOne(docToInsert);

    return mapBlogDbToViewModel(docToInsert);
  },

  async update(id: string, dto: BlogInputDto): Promise<boolean> {
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

    return updatedResult.matchedCount === 1;
  },

  async delete(id: string): Promise<boolean> {
    const deletedResult = await blogsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return deletedResult.deletedCount === 1;
  },

  async clear(): Promise<void> {
    await blogsCollection.deleteMany({});
  },
};
