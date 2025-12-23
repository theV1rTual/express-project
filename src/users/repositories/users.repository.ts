import { UserQueryInput } from '../routers/input/user-query.input';
import { UserDbModel } from '../types/UserDbModel';
import { usersCollection } from '../../db/mongo.db';
import { ObjectId } from 'mongodb';
import { UserViewModel } from '../types/UserViewModel';
import { mapUserDbToUserView } from '../routers/mappers/mapUserDbToUserView';
import { UserInputDto } from '../dto/user.input-dto';

export const usersRepository = {
  async findAll(
    queryDto: UserQueryInput,
  ): Promise<{ items: UserDbModel[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchEmailTerm) {
      filter.email = { $regex: searchEmailTerm, $options: 'i' };
    }

    if (searchLoginTerm) {
      filter.login = { $regex: searchLoginTerm, $options: 'i' };
    }

    const mongoSortDirection = sortDirection === 'asc' ? 1 : -1;

    const items = await usersCollection
      .find(filter)
      .sort({ [sortBy]: mongoSortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await usersCollection.countDocuments(filter);
    return { items, totalCount };
  },

  async findById(id: string): Promise<UserViewModel | null> {
    const userDb = await usersCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!userDb) {
      return null;
    }

    return mapUserDbToUserView(userDb);
  },

  async findByLogin(login: string): Promise<boolean> {
    const userDb = await usersCollection.findOne({ login });

    if (userDb) {
      return false;
    }

    return true;
  },

  async findByEmail(email: string): Promise<boolean> {
    const userDb = await usersCollection.findOne({ email });
    if (userDb) {
      return false;
    }

    return true;
  },

  async findByEmailOrLogin(emailOrLogin: string) {
    return usersCollection.findOne({
      $or: [{ login: emailOrLogin }, { email: emailOrLogin }],
    });
  },

  async createUser(
    user: UserInputDto,
    passwordHash: string,
  ): Promise<UserViewModel | null> {
    const docToInsert: UserDbModel = {
      _id: new ObjectId(),
      createdAt: new Date(),
      login: user.login,
      email: user.email,
      passwordHash,
    };
    await usersCollection.insertOne(docToInsert);

    return mapUserDbToUserView(docToInsert);
  },

  async delete(id: string): Promise<boolean> {
    const deletedResult = await usersCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return deletedResult.deletedCount === 1;
  },

  async clear(): Promise<void> {
    await usersCollection.deleteMany({});
  },
};
