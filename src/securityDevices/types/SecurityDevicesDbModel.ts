import { ObjectId } from 'mongodb';

export type SecurityDevicesDbModel = {
  _id: ObjectId;
  title: string;
  lastActiveDate: Date;
  deviceId: string;
  userId: ObjectId;
};
