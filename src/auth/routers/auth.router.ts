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
import { usersRepository } from '../../users/repositories/users.repository';
import { createErrorMessages } from '../../core/utils/error.utils';
import { jwtService } from '../adapters/jwt.service';
import { ObjectId } from 'mongodb';
import {
  refreshTokensCollection,
  securityDevicesCollection,
} from '../../db/mongo.db';
import { randomUUID } from 'crypto';
import { add } from 'date-fns/add';
import { SETTINGS } from '../../core/settings/settings';

export const authRouter = Router({});

authRouter.post(
  routersPaths.auth.login,
  passwordValidation,
  inputValidationResultMiddleware,
  async (req: RequestWithBody<AuthInputDto>, res: Response) => {
    const { loginOrEmail, password } = req.body;

    const result = await authService.login(loginOrEmail, password);
    const deviceId = randomUUID();
    const title = req.headers['user-agent'];

    if (result.status !== ResultStatus.Success) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send(result.extensions);
    }

    const { refreshToken, accessToken, userId } = result.data!;

    res.cookie(
      'refreshToken',
      {
        refreshToken,
        deviceId,
        userId,
      },
      {
        httpOnly: true,
        secure: true,
      },
    );

    await refreshTokensCollection.insertOne({
      _id: new ObjectId(),
      value: refreshToken as string,
      userId: userId,
      isValid: true,
      deviceId,
    });

    await securityDevicesCollection.insertOne({
      _id: new ObjectId(),
      deviceId,
      userId,
      lastActiveDate: new Date(),
      title: title ? title : '',
      ip: req.ip as string,
      expiredAt: add(new Date(), {
        seconds: SETTINGS.RF_TIME,
      }),
    });

    return res.status(HttpStatuses.OK).send({ accessToken });
  },
);

authRouter.post(
  routersPaths.auth.refreshToken,
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const deviceId = refreshToken.deviceId;

    if (!refreshToken) {
      return res.sendStatus(HttpStatuses.UNAUTHORIZED);
    }

    const tokenDoc = await refreshTokensCollection.findOne({
      value: refreshToken,
    });

    if (!tokenDoc || !tokenDoc.isValid) {
      return res.sendStatus(HttpStatuses.UNAUTHORIZED);
    }

    const payload = await jwtService.verifyRefreshToken(refreshToken);

    if (!payload) {
      return res.sendStatus(HttpStatuses.UNAUTHORIZED);
    }

    const userId = tokenDoc.userId.toString();

    await refreshTokensCollection.updateOne(
      { _id: tokenDoc._id },
      { $set: { isValid: false } },
    );

    const accessToken = await jwtService.createAccessToken(userId);

    const newRefreshToken = await jwtService.createRefreshToken(userId);

    await refreshTokensCollection.insertOne({
      _id: new ObjectId(),
      value: newRefreshToken as string,
      userId: new ObjectId(userId),
      isValid: true,
      deviceId,
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.status(HttpStatuses.OK).send({ accessToken });
  },
);

authRouter.post(
  routersPaths.auth.logout,
  async (req: Request, res: Response) => {
    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(HttpStatuses.UNAUTHORIZED);
    }

    const payload = await jwtService.verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.sendStatus(HttpStatuses.UNAUTHORIZED);
    }

    const tokenDoc = await refreshTokensCollection.findOne({
      value: refreshToken,
    });

    if (!tokenDoc || !tokenDoc.isValid) {
      return res.sendStatus(HttpStatuses.UNAUTHORIZED);
    }

    await refreshTokensCollection.updateOne(
      { _id: tokenDoc._id, isValid: true },
      { $set: { isValid: false } },
    );

    res.clearCookie('refreshToken');
    return res.sendStatus(HttpStatuses.NO_CONTENT);
  },
);

authRouter.get(
  routersPaths.auth.me,
  accessTokenGuard,
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const me = await usersRepository.findById(userId, true);

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
    if (result.status === ResultStatus.BadRequest) {
      res
        .status(HttpStatuses.BAD_REQUEST)
        .send(
          createErrorMessages([{ field: 'code', message: 'Code is wrong' }]),
        );
      return;
    }
    if (result.status === ResultStatus.Success) {
      return res.sendStatus(HttpStatuses.NO_CONTENT);
    }
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
    if (result.status === ResultStatus.NotFound) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send(
          createErrorMessages([{ field: 'email', message: 'Email not found' }]),
        );
    }
    if (result.status === ResultStatus.BadRequest) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send(
          createErrorMessages([
            { field: 'email', message: 'Email is already confirmed' },
          ]),
        );
    }
    if (result?.status === ResultStatus.Success) {
      return res.sendStatus(HttpStatuses.NO_CONTENT);
    }
  },
);
