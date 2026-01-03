import { ObjectId } from 'mongodb';

export type UserDbModel = {
  _id: ObjectId;
  login: string;
  email: string;
  createdAt: Date;
  passwordHash: string;
  emailConfirmation: {
    confirmationCode: string | null;
    expirationDate: Date | null;
    isConfirmed: boolean;
  };
};
