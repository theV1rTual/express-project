import { ObjectId } from 'mongodb';

export type RefreshTokenDb = {
  _id: ObjectId;
  userId: ObjectId;
  value: string;
  isValid: boolean;
};
