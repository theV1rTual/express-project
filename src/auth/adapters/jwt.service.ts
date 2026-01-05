import jwt from 'jsonwebtoken';
import { SETTINGS } from '../../core/settings/settings';

export const jwtService = {
  async createAccessToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, SETTINGS.AC_SECRET, {
      expiresIn: SETTINGS.AC_TIME,
    });
  },

  async createRefreshToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, SETTINGS.AC_SECRET, {
      expiresIn: SETTINGS.RF_TIME,
    });
  },

  async verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(token, SETTINGS.AC_SECRET) as { userId: string };
    } catch (e) {
      console.log('Token verification failed');
      return null;
    }
  },
};
