import { AuthInputDto } from '../routers/input/auth.input';
import { bcryptService } from '../adapters/bcrypt.service';
import { usersRepository } from '../../users/repositories/users.repository';

export const authService = {
  async login(queryDto: AuthInputDto) {
    const user = await this.checkCredentials(
      queryDto.loginOrEmail,
      queryDto.password,
    );

    if (!user) {
      return null;
    }

    return user;
  },

  async checkCredentials(loginOrEmail: string, password: string) {
    const identifier = loginOrEmail.trim().toLowerCase();

    const user = await usersRepository.findByEmailOrLogin(identifier);

    if (!user) {
      return null;
    }

    const ok = await bcryptService.checkPassword(password, user.passwordHash);
    return ok ? user : null;
  },
};
