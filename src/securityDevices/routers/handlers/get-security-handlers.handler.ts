import { Request, Response } from 'express';
import { securityDevicesCollection } from '../../../db/mongo.db';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { mapSecurityDevicesDbToView } from '../mappers/mapSecurityDevices';
import { jwtService } from '../../../auth/adapters/jwt.service';
import { ObjectId } from 'mongodb';

export async function getSecurityDevicesHandler(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies;

    if (!(await jwtService.verifyRefreshToken(refreshToken.refreshToken))) {
      return res.sendStatus(HttpStatuses.UNAUTHORIZED);
    }

    const result = await securityDevicesCollection
      .find({ userId: new ObjectId(refreshToken.userId) })
      .toArray();

    if (!result) {
      return res.sendStatus(HttpStatuses.NOT_FOUND);
    }

    const view = result.map(mapSecurityDevicesDbToView);
    return res.status(HttpStatuses.OK).send(view);
  } catch (e) {
    return res.sendStatus(HttpStatuses.INTERNAL_SERVER_ERROR);
  }
}
