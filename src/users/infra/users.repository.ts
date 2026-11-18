import { UserQueryInput } from '../routers/input/user-query.input';
import { UserDbModel } from '../types/UserDbModel';
import { ObjectId } from 'mongodb';
import { UserViewModel } from '../types/UserViewModel';
import { mapUserDbToUserView } from '../routers/mappers/mapUserDbToUserView';
import { UserInputDto } from '../dto/user.input-dto';
import { add } from 'date-fns/add';
import { randomUUID } from 'crypto';
import { ResultStatus } from '../../core/result /resultCode';
import { Result } from '../../core/result /result.type';
import { mapUserDbToMeRequest } from '../routers/mappers/mapUserDbToMeRequest';
import { UserMeModel } from '../types/UserMeModel';
import { UserEntity } from '../domain/user.entity';

export class UsersRepository {
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

    const items = await UserDbModel
      .find(filter)
      .sort({ [sortBy]: mongoSortDirection })
      .skip(skip)
      .limit(pageSize)

    const totalCount = await UserDbModel.countDocuments(filter);
    return { items, totalCount };
  }

  async findById(
    id: string,
    meRequest?: boolean,
  ): Promise<UserViewModel | UserMeModel | null> {
    const userDb = await UserDbModel.findOne({
      _id: new ObjectId(id),
    });
    if (!userDb) {
      return null;
    }

    if (meRequest) {
      return mapUserDbToMeRequest(userDb);
    }

    return mapUserDbToUserView(userDb);
  }

  async findByLogin(login: string) {
    return UserDbModel.findOne({ login });
  }

  async findByEmail(email: string) {
    return UserDbModel.findOne({ email });
  }

  async findByEmailOrLogin(emailOrLogin: string) {
    return UserDbModel.findOne({
      $or: [{ login: emailOrLogin }, { email: emailOrLogin }],
    });
  }

  async doesExistByLoginOrEmail(login: string, email: string) {
    return UserDbModel.findOne({
      $or: [{ login: login }, { email: email }],
    });
  }

  async findByCode(code: string) {
    return UserDbModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }

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

    const result = await UserDbModel.updateOne(
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
  }

  async createUser(
    user: UserEntity,
  ): Promise<UserDbModel> {
    const docToInsert: UserDbModel = {
      _id: new ObjectId(),
      createdAt: user.createdAt,
      login: user.login,
      email: user.email,
      passwordHash: user.passwordHash,
      emailConfirmation: user.emailConfirmation,
      passwordRecovery: user.passwordRecovery,
      // passwordRecovery: {
      //   recoveryCode: null,
      //   expirationDate: null,
      // },
      refreshToken: null,
    };
    const savedUser = await UserDbModel.insertOne(docToInsert);
    return savedUser.toObject();
    // if (registration) {
    //   return docToInsert;
    // }

    // return mapUserDbToUserView(docToInsert);
  }

  async setConfirmation(
    id: ObjectId,
    payload: UserDbModel['emailConfirmation'],
  ) {
    const result = await UserDbModel.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: { emailConfirmation: payload },
      },
    );
    return result.matchedCount === 1;
  }

  async setRecovery(id: ObjectId, payload: UserDbModel['passwordRecovery']) {
    const result = await UserDbModel.updateOne(
      {
        _id: new ObjectId(id)
      },
      {
        $set: { passwordRecovery: payload }
      }
    )
  }

  async updatePasswordByRecoveryCode(
    recoveryCode: string,
    passwordHash: string,
  ): Promise<boolean> {
    const result = await UserDbModel.updateOne(
      {
        'passwordRecovery.recoveryCode': recoveryCode,
        'passwordRecovery.expirationDate': { $gt: new Date() },
      },
      {
        $set: {
          passwordHash,
          'passwordRecovery.recoveryCode': null,
          'passwordRecovery.expirationDate': null,
        },
      },
    );

    return result.matchedCount === 1;
  }

  async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
      return false;
    }

    const deletedResult = await UserDbModel.deleteOne({
      _id: new ObjectId(id),
    });

    return deletedResult.deletedCount === 1;
  }

  async clear(): Promise<void> {
    await UserDbModel.deleteMany({});
  }
};
