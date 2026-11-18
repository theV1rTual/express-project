import { UserQueryInput } from '../routers/input/user-query.input';
import { UserDbModel } from '../types/UserDbModel';
import { UsersRepository, } from '../infra/users.repository';
import { UserInputDto } from '../dto/user.input-dto';
import { bcryptService } from '../../auth/adapters/bcrypt.service';
import { UserViewModel } from '../types/UserViewModel';
import { UserMeModel } from '../types/UserMeModel';
import { UserEntity } from '../domain/user.entity';
import { inject, injectable } from 'inversify';
import { mapUserDbToUserView } from '../routers/mappers/mapUserDbToUserView';

@injectable()
export class UserService {
  constructor(
    @inject(UsersRepository)
    private readonly usersRepository: UsersRepository
  ) { }

  async findMany(
    queryDto: UserQueryInput,
  ): Promise<{ items: UserDbModel[]; totalCount: number }> {
    return this.usersRepository.findAll(queryDto);
  }

  async findById(
    id: string,
    me?: boolean,
  ): Promise<UserViewModel | UserMeModel | null> {
    return this.usersRepository.findById(id, me);
  }

  async createUser(input: UserInputDto, registration?: boolean) {
    const login = input.login.trim();
    const email = input.email.trim();

    const loginExists = await this.usersRepository.findByLogin(login);
    if (loginExists)
      return { field: 'login', message: 'login should be unique' };

    const emailExists = await this.usersRepository.findByEmail(email);
    if (emailExists)
      return { field: 'email', message: 'email should be unique' };

    const passwordHash = await bcryptService.generateHash(input.password);

    const user = UserEntity.createUser({
      login,
      email,
      passwordHash
    })

    const savedUser = await this.usersRepository.createUser(user)
    return mapUserDbToUserView(savedUser);

  }

  async deleteUser(id: string): Promise<boolean> {
    return this.usersRepository.delete(id)
  }
};
