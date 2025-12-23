import { UserQueryInput } from '../routers/input/user-query.input';
import { UserDbModel } from '../types/UserDbModel';
import { usersRepository } from '../repositories/users.repository';
import { UserInputDto } from '../dto/user.input-dto';
import { bcryptService } from '../../auth/adapters/bcrypt.service';

export const userService = {
  async findMany(
    queryDto: UserQueryInput,
  ): Promise<{ items: UserDbModel[]; totalCount: number }> {
    return usersRepository.findAll(queryDto);
  },

  async createUser(user: UserInputDto) {
    const login = user.login.trim();

    const exists = await usersRepository.findByEmail(login);

    if (exists) {
      return null;
    }

    const passwordHash = await bcryptService.generateHash(user.password);
    return await usersRepository.createUser(user, passwordHash);
  },
};
