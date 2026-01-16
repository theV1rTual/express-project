import { Request, Response } from 'express';
import { jwtService } from '../../../auth/adapters/jwt.service';
import { HttpStatuses } from '../../../core/types/http-statuses';
import {
  refreshTokensCollection,
  securityDevicesCollection,
} from '../../../db/mongo.db';
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

  const tokenDoc = await refreshTokensCollection.findOne({
    value: refreshToken,
  });

  if (!tokenDoc || !tokenDoc.isValid) {
    return res.sendStatus(HttpStatuses.UNAUTHORIZED);
  }

  const result = await securityDevicesCollection.deleteMany({
    userId: new ObjectId(payload?.userId),
    deviceId: { $ne: payload.deviceId }, // ← key fix
  });

  if (result) {
    return res.sendStatus(HttpStatuses.NO_CONTENT);
  }

  return res.sendStatus(HttpStatuses.INTERNAL_SERVER_ERROR);
}
