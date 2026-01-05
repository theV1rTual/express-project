import { UserQueryInput } from '../routers/input/user-query.input';
import { UserDbModel } from '../types/UserDbModel';
import { usersCollection } from '../../db/mongo.db';
import { ObjectId } from 'mongodb';
import { UserViewModel } from '../types/UserViewModel';
import { mapUserDbToUserView } from '../routers/mappers/mapUserDbToUserView';
import { UserInputDto } from '../dto/user.input-dto';
import { add } from 'date-fns/add';
import { randomUUID } from 'crypto';
import { ResultStatus } from '../../core/result /resultCode';
import { Result } from '../../core/result /result.type';

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
    const or: any[] = [];

    const emailTerm = searchEmailTerm?.trim();
    const loginTerm = searchLoginTerm?.trim();

    if (emailTerm) {
      or.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
    }

    if (loginTerm) {
      or.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
    }

    const filter = or.length ? { $or: or } : {};

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

  async findByLogin(login: string) {
    return usersCollection.findOne({ login });
  },

  async findByEmail(email: string) {
    return usersCollection.findOne({ email });
  },

  async findByEmailOrLogin(emailOrLogin: string) {
    return usersCollection.findOne({
      $or: [{ login: emailOrLogin }, { email: emailOrLogin }],
    });
  },

  async doesExistByLoginOrEmail(login: string, email: string) {
    return usersCollection.findOne({
      $or: [{ login: login }, { email: email }],
    });
  },

  async findByCode(code: string) {
    return usersCollection.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  },

  async confirmRegistration(code: string): Promise<Result<null>> {
    const user = await this.findByCode(code);

    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: 'code', message: 'Code not found' }],
      };
    }

    if (user.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [{ field: 'code', message: 'Code is already confirmed' }],
      };
    }

    const result = await usersCollection.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          'emailConfirmation.isConfirmed': true,
        },
      },
    );

    if (result.matchedCount === 1) {
      return {
        status: ResultStatus.Success,
        data: null,
        extensions: [],
      };
    }

    return {
      status: ResultStatus.BadRequest,
      data: null,
      extensions: [],
    };
  },

  async createUser(
    user: UserInputDto,
    passwordHash: string,
    registration?: boolean,
  ): Promise<UserViewModel | null | UserDbModel> {
    const docToInsert: UserDbModel = {
      _id: new ObjectId(),
      createdAt: new Date(),
      login: user.login,
      email: user.email,
      passwordHash,
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: false,
      },
      refreshToken: null,
    };
    await usersCollection.insertOne(docToInsert);

    if (registration) {
      return docToInsert;
    }

    return mapUserDbToUserView(docToInsert);
  },

  async setConfirmation(
    id: ObjectId,
    payload: UserDbModel['emailConfirmation'],
  ) {
    const result = await usersCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: { emailConfirmation: payload },
      },
    );
    return result.matchedCount === 1;
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
