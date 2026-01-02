import { Router } from 'express';
import { routersPaths } from '../../core/paths/paths';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { AuthInputDto } from './input/auth.input';
import { RequestWithBody } from '../../core/types/requests';
import { authService } from '../application/auth.service';
import { ResultStatus } from '../../core/result /resultCode';
import { resultCodeToHttpException } from '../../core/result /resultCodeToHttpException';
import { Request, Response } from 'express';
import { HttpStatuses } from '../../core/types/http-statuses';
import { passwordValidation } from '../../users/validation/user.input-dto.validation-middlewares';
import { accessTokenGuard } from '../guards/access.token.guard';
import { userService } from '../../users/application/user.service';

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
