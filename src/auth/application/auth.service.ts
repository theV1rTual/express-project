import { usersRepository } from '../../users/repositories/users.repository';
import { UserDbModel } from '../../users/types/UserDbModel';
import { Result } from '../../core/result /result.type';
import { ResultStatus } from '../../core/result /resultCode';
import { bcryptService } from '../adapters/bcrypt.service';
import { jwtService } from '../adapters/jwt.service';
import { UserInputDto } from '../../users/dto/user.input-dto';
import { userService } from '../../users/application/user.service';
import { nodemailerService } from '../adapters/nodemailer.service';
import { emailExamples } from '../adapters/emailExamples';

export const authService = {
  async login(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<{ accessToken: string } | null>> {
    const result = await this.checkCredentials(loginOrEmail, password);
    if (result.status !== ResultStatus.Success) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Unauthorized',
        extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
        data: null,
      };
    }

    const accessToken = await jwtService.createToken(
      result.data!._id.toString(),
    );

    return {
      status: ResultStatus.Success,
      data: { accessToken },
      extensions: [],
    };
  },

  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<UserDbModel | null>> {
    const user = await usersRepository.findByEmailOrLogin(loginOrEmail);
    if (!user) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorMessage: 'Not Found',
        extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
      };
    }

    const isPassCorrect = await bcryptService.checkPassword(
      password,
      user.passwordHash,
    );

    if (!isPassCorrect) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorMessage: 'Bad Request',
        extensions: [{ field: 'password', message: 'Wrong password' }],
      };
    }

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
  },

  async resendEmail(email: string) {
    const user = await usersRepository.findByEmail(email);
    if (!user || user.emailConfirmation.isConfirmed) {
      return null;
    }

    nodemailerService
      .sendEmail(
        email,
        user.emailConfirmation.confirmationCode as string,
        emailExamples.registrationEmail,
      )
      .catch((er) => console.log('error in send email', er));

    return {
      status: ResultStatus.Success,
      extensions: [],
    };
  },

  async registerUser(login: string, password: string, email: string) {
    const user = await usersRepository.doesExistByLoginOrEmail(login, email);
    if (user) return null;

    const newUser: UserInputDto = {
      login,
      email,
      password,
    };

    const createdUser = (await userService.createUser(
      newUser,
      true,
    )) as UserDbModel;

    try {
      await nodemailerService.sendEmail(
        createdUser.email,
        createdUser.emailConfirmation.confirmationCode!,
        emailExamples.registrationEmail,
      );
    } catch (e) {
      console.log('error in send email', e);
      // чтобы тест не ждал письмо бесконечно
      return { status: ResultStatus.BadRequest, data: null, extensions: [] };
    }

    return {
      status: ResultStatus.Success,
      data: newUser,
      extensions: [],
    };
  },
};
