import { Request, Response, NextFunction } from 'express';
import { HttpStatuses } from '../../core/types/http-statuses';
import { jwtService } from '../adapters/jwt.service';
import { IdType } from '../../core/types/id';

export const accessTokenGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization)
    return res.sendStatus(HttpStatuses.UNAUTHORIZED);

  const [authType, token] = req.headers.authorization.split(' ');

  if (authType !== 'Bearer') return res.sendStatus(HttpStatuses.UNAUTHORIZED);

  const payload = await jwtService.verifyToken(token);

  if (payload) {
    const { userId } = payload;
    req.user = { id: userId } as IdType;
    next();

    return;
  }

  res.sendStatus(HttpStatuses.UNAUTHORIZED);

  return;
};
