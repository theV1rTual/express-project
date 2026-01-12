import { Request, Response } from 'express';
import { jwtService } from '../../../auth/adapters/jwt.service';
import { HttpStatuses } from '../../../core/types/http-statuses';
import {
  refreshTokensCollection,
  securityDevicesCollection,
} from '../../../db/mongo.db';
import { ObjectId } from 'mongodb';

export async function deviceSecurityDeviceHandler(req: Request, res: Response) {
  const deviceId = req.params.deviceId;
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  const payload = await jwtService.verifyRefreshToken(refreshToken);

  if (!payload) {
    return res.sendStatus(HttpStatuses.UNAUTHORIZED);
  }

  const doc = await securityDevicesCollection.findOne({ deviceId });
  if (!doc) {
    return res.sendStatus(HttpStatuses.NOT_FOUND);
  }

  if (doc.userId.toString() !== payload?.userId) {
    return res.sendStatus(HttpStatuses.FORBIDDEN);
  }

  const result = await securityDevicesCollection.deleteOne({
    deviceId,
    userId: new ObjectId(payload.userId),
  });

  if (result.deletedCount === 1) {
    await refreshTokensCollection.updateOne(
      {
        value: refreshToken,
      },
      {
        $set: {
          isValid: false,
        },
      },
    );

    return res.sendStatus(HttpStatuses.NO_CONTENT);
  }

  return res.sendStatus(HttpStatuses.INTERNAL_SERVER_ERROR);
}
