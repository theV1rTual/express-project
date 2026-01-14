import { Request, Response } from 'express';
import {
  refreshTokensCollection,
  securityDevicesCollection,
} from '../../../db/mongo.db';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { mapSecurityDevicesDbToView } from '../mappers/mapSecurityDevices';
import { jwtService } from '../../../auth/adapters/jwt.service';
import { ObjectId } from 'mongodb';

export async function getSecurityDevicesHandler(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(HttpStatuses.UNAUTHORIZED);

  const payload = await jwtService.verifyRefreshToken(refreshToken);
  if (!payload) return res.sendStatus(HttpStatuses.UNAUTHORIZED);

  const tokenDoc = await refreshTokensCollection.findOne({
    value: refreshToken,
  });
  if (!tokenDoc || !tokenDoc.isValid) {
    return res.sendStatus(HttpStatuses.UNAUTHORIZED);
  }

  const result = await securityDevicesCollection
    .find({ userId: new ObjectId(payload.userId) })
    .toArray();

  const view = result.map(mapSecurityDevicesDbToView);
  return res.status(HttpStatuses.OK).send(view);
}
