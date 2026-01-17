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
  if (!refreshToken) {
    return res.sendStatus(HttpStatuses.UNAUTHORIZED);
  }

  const payload = await jwtService.verifyRefreshToken(refreshToken);
  if (!payload) {
    return res.sendStatus(HttpStatuses.UNAUTHORIZED);
  }

  // текущий токен должен быть валиден
  const tokenDoc = await refreshTokensCollection.findOne({
    value: refreshToken,
  });
  if (!tokenDoc || !tokenDoc.isValid) {
    return res.sendStatus(HttpStatuses.UNAUTHORIZED);
  }

  const userObjectId = new ObjectId(payload.userId);
  const currentDeviceId = payload.deviceId;

  // 1) удалить ВСЕ другие devices
  await securityDevicesCollection.deleteMany({
    userId: userObjectId,
    deviceId: { $ne: currentDeviceId },
  });

  // 2) сделать refresh tokens для других devices НЕвалидными
  await refreshTokensCollection.updateMany(
    {
      userId: userObjectId,
      deviceId: { $ne: currentDeviceId },
      isValid: true,
    },
    { $set: { isValid: false } },
  );

  return res.sendStatus(HttpStatuses.NO_CONTENT);
}
