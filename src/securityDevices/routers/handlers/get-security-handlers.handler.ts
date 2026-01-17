import { Request, Response } from 'express';
import { securityDevicesCollection } from '../../../db/mongo.db';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { mapSecurityDevicesDbToView } from '../mappers/mapSecurityDevices';
import { jwtService } from '../../../auth/adapters/jwt.service';
import { ObjectId } from 'mongodb';

export async function getSecurityDevicesHandler(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.sendStatus(HttpStatuses.UNAUTHORIZED);
    }

    const payload = await jwtService.verifyRefreshToken(refreshToken);
    if (!payload) {
      return res.sendStatus(HttpStatuses.UNAUTHORIZED);
    }

    const result = await securityDevicesCollection
      .find({ userId: new ObjectId(payload?.userId) })
      .toArray();

    return res
      .status(HttpStatuses.OK)
      .send(result.map(mapSecurityDevicesDbToView));
  } catch (e) {
    return res.sendStatus(HttpStatuses.INTERNAL_SERVER_ERROR);
  }
}
