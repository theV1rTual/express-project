import { Request, Response } from 'express';
import { jwtService } from '../../../auth/adapters/jwt.service';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { securityDevicesCollection } from '../../../db/mongo.db';

export async function deleteAllSecurityDevicesHandler(
  req: Request,
  res: Response,
) {
  const refreshToken = req.cookies.refreshToken;

  if (!(await jwtService.verifyRefreshToken(refreshToken.refreshToken))) {
    return res.sendStatus(HttpStatuses.UNAUTHORIZED);
  }

  const result = await securityDevicesCollection.deleteMany({
    userId: refreshToken.userId,
  });

  if (result) {
    return res.sendStatus(HttpStatuses.NO_CONTENT);
  }

  return res.sendStatus(HttpStatuses.INTERNAL_SERVER_ERROR);
}
