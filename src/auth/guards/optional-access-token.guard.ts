import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { jwtService } from '../adapters/jwt.service';

// Public reads remain accessible without a valid token.
export async function optionalAccessTokenGuard(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const [scheme, token] = req.headers.authorization?.split(' ') ?? [];
  if (scheme === 'Bearer' && token) {
    const payload = await jwtService.verifyToken(token);
    if (
      typeof payload?.userId === 'string' &&
      ObjectId.isValid(payload.userId)
    ) {
      req.user = { id: payload.userId };
    }
  }
  next();
}
