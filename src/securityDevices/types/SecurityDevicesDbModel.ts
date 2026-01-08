import { ObjectId } from 'mongodb';

export type SecurityDevicesDbModel = {
  userId: ObjectId;
  _id: ObjectId;

  deviceId: string;
  title: string;
  ip: string;

  lastActiveDate: Date;
  expiredAt: Date;
};
