import { Request, Response } from 'express';
import { jwtService } from '../../../auth/adapters/jwt.service';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { securityDevicesCollection } from '../../../db/mongo.db';

export async function deviceSecurityDeviceHandler(req: Request, res: Response) {
  const deviceId = req.params.deviceId;
  const refreshToken = req.cookies.refreshToken;

  if (!(await jwtService.verifyRefreshToken(refreshToken.refreshToken))) {
    return res.sendStatus(HttpStatuses.UNAUTHORIZED);
  }

  const doc = await securityDevicesCollection.findOne({ deviceId });
  if (!doc) {
    return res.sendStatus(HttpStatuses.NOT_FOUND);
  }

  if (doc.userId !== refreshToken.userId) {
    return res.sendStatus(HttpStatuses.FORBIDDEN);
  }

  const result = await securityDevicesCollection.deleteOne({
    deviceId,
    userId: refreshToken.userId,
  });
}
