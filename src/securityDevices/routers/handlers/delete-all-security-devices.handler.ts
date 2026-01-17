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
  if (!refreshToken) {
    return res.sendStatus(HttpStatuses.UNAUTHORIZED);
  }

  const payload = await jwtService.verifyRefreshToken(refreshToken);
  if (!payload) {
    return res.sendStatus(HttpStatuses.UNAUTHORIZED);
  }

  await securityDevicesCollection.deleteMany({
    userId: new ObjectId(payload?.userId),
    deviceId: { $ne: payload.deviceId },
  });
  return res.sendStatus(HttpStatuses.NO_CONTENT);
}
