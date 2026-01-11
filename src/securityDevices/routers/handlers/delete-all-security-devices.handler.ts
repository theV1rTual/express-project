import { Request, Response } from 'express';
import { jwtService } from '../../../auth/adapters/jwt.service';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { securityDevicesCollection } from '../../../db/mongo.db';
import { ObjectId } from 'mongodb';

export async function deleteAllSecurityDevicesHandler(
  req: Request,
  res: Response,
) {
  const refreshToken = req.cookies.refreshToken;
  const payload = await jwtService.verifyRefreshToken(refreshToken);

  if (!payload) {
    return res.sendStatus(HttpStatuses.UNAUTHORIZED);
  }

  const result = await securityDevicesCollection.deleteMany({
    userId: new ObjectId(payload?.userId),
  });

  if (result) {
    return res.sendStatus(HttpStatuses.NO_CONTENT);
  }

  return res.sendStatus(HttpStatuses.INTERNAL_SERVER_ERROR);
}
