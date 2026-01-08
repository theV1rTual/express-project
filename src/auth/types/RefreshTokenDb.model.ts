import { ObjectId } from 'mongodb';

export type RefreshTokenDb = {
  _id: ObjectId;
  userId: ObjectId;
  deviceId: string;
  value: string;
  isValid: boolean;
};
