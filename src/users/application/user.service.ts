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
    const email = user.email.trim();

    const loginExists = await usersRepository.findByLogin(login);
    if (loginExists) return { field: 'login', message: 'login should be unique' };

    const emailExists = await usersRepository.findByEmail(email);
    if (emailExists) return { field: 'email', message: 'email should be unique' };

    const passwordHash = await bcryptService.generateHash(user.password);
    return await usersRepository.createUser(user, passwordHash);
  },
};
