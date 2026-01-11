import jwt from 'jsonwebtoken';
import { SETTINGS } from '../../core/settings/settings';

export const jwtService = {
  async createAccessToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, SETTINGS.AC_SECRET, {
      expiresIn: SETTINGS.AC_TIME,
    });
  },

  async createRefreshToken(userId: string, deviceId: string): Promise<string> {
    return jwt.sign({ userId, deviceId }, SETTINGS.RF_SECRET, {
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

  async verifyRefreshToken(
    token: string,
  ): Promise<{ userId: string; refreshToken: string } | null> {
    try {
      return jwt.verify(token, SETTINGS.RF_SECRET) as {
        userId: string;
        refreshToken: string;
      };
    } catch (e) {
      console.log('Token verification failed');
      return null;
    }
  },
};
