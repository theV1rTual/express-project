import { Request, Response } from 'express';
import { authService } from '../../application/auth.service';
import { HttpStatuses } from '../../../core/types/http-statuses';

export async function authHandler(req: Request, res: Response) {
  const user = await authService.login({
    loginOrEmail: req.body.loginOrEmail,
    password: req.body.password,
  });

  if (user) {
    return res.sendStatus(HttpStatuses.NO_CONTENT);
  }

  return res.sendStatus(HttpStatuses.UNAUTHORIZED);
}
