import { Request, Response, NextFunction } from 'express';
import { apiRequestLogCollection } from '../../db/mongo.db';
import { HttpStatuses } from '../types/http-statuses';

const WINDOW_SEC = 10;
const MAX_REQUESTS = 5;

export async function ipUrlRateLimiterMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const ip = req.ip;
  const url = req.originalUrl;

  const now = new Date();
  const fromDate = new Date(now.getTime() - WINDOW_SEC * 1000);

  await apiRequestLogCollection.insertOne({
    ip: ip as string,
    url,
    date: now,
  });

  const count = await apiRequestLogCollection.countDocuments({
    ip,
    url,
    date: { $gte: fromDate },
  });

  if (count > MAX_REQUESTS) {
    return res.sendStatus(HttpStatuses.TOO_MANY_REQUESTS);
  }

  return next();
}
