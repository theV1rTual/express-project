import { Request, Response, Router } from 'express';
import { routersPaths } from '../../core/paths/paths';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { AuthInputDto } from './input/auth.input';
import { RequestWithBody } from '../../core/types/requests';
import { authService } from '../application/auth.service';
import { ResultStatus } from '../../core/result /resultCode';
import { resultCodeToHttpException } from '../../core/result /resultCodeToHttpException';
import { HttpStatuses } from '../../core/types/http-statuses';
import {
  emailValidation,
  loginValidation,
  passwordValidation,
} from '../../users/validation/user.input-dto.validation-middlewares';
import { accessTokenGuard } from '../guards/access.token.guard';
import { userService } from '../../users/application/user.service';
import { usersRepository } from '../../users/repositories/users.repository';
import { createErrorMessages } from '../../core/utils/error.utils';

export const authRouter = Router({});

authRouter.post(
  routersPaths.auth.login,
  passwordValidation,
  inputValidationResultMiddleware,
  async (req: RequestWithBody<AuthInputDto>, res: Response) => {
    const { loginOrEmail, password } = req.body;

    const result = await authService.login(loginOrEmail, password);

    if (result.status !== ResultStatus.Success) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send(result.extensions);
    }

    return res
      .status(HttpStatuses.OK)
      .send({ accessToken: result.data?.accessToken });
  },
);

authRouter.get(
  routersPaths.auth.me,
  accessTokenGuard,
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    if (!userId) {
      return res.sendStatus(HttpStatuses.UNAUTHORIZED);
    }

    const me = await userService.findById(userId);

    return res.status(HttpStatuses.OK).send(me);
  },
);

authRouter.post(
  routersPaths.auth.registrationConfirmation,
  async (req: Request, res: Response) => {
    const user = await usersRepository.findByCode(req.body.code);
    if (!user) {
      res
        .status(HttpStatuses.BAD_REQUEST)
        .send(
          createErrorMessages([{ field: 'code', message: 'Code is wrong' }]),
        );
      return;
    }

    let result = await usersRepository.confirmRegistration(req.body.code);
    if (!result) {
      res
        .status(HttpStatuses.BAD_REQUEST)
        .send(
          createErrorMessages([{ field: 'code', message: 'Code is wrong' }]),
        );
      return;
    }

    return res.sendStatus(HttpStatuses.NO_CONTENT);
  },
);

authRouter.post(
  routersPaths.auth.registration,
  passwordValidation,
  loginValidation,
  emailValidation,
  inputValidationResultMiddleware,
  async (req: Request, res: Response) => {
    const { login, email, password } = req.body;
    const result = await authService.registerUser(login, password, email);
    if (result.status === ResultStatus.BadRequest) {
      return res.status(HttpStatuses.BAD_REQUEST).send({
        errorsMessages: result.extensions.map((e) => ({
          field: e.field,
          message: e.message,
        })),
      });
    }
    if (result?.status === ResultStatus.Success) {
      return res.sendStatus(HttpStatuses.NO_CONTENT);
    }
    return res.sendStatus(resultCodeToHttpException(result.status));
  },
);

authRouter.post(
  routersPaths.auth.registrationEmailResending,
  emailValidation,
  inputValidationResultMiddleware,
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await authService.resendEmail(email);
    if (!result) {
      return res
        .status(HttpStatuses.BAD_REQUEST)
        .send(
          createErrorMessages([{ field: 'email', message: 'Email is wrong' }]),
        );
    }
    if (result?.status === ResultStatus.Success) {
      return res.sendStatus(HttpStatuses.NO_CONTENT);
    }
  },
);
