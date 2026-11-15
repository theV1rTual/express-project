import { ObjectId } from 'mongodb';
import mongoose, { Schema } from 'mongoose';

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
  passwordRecovery: {
    recoveryCode: string | null,
    expirationDate: Date | null
  };
  refreshToken: string | null;
};

export const UserDbModelSchema = new Schema<UserDbModel>({
  login: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, required: true },
  passwordHash: { type: String, required: true },
  emailConfirmation: {
    confirmationCode: { type: String, required: true, default: null },
    expirationDate: { type: Date, required: true, default: null },
    isConfirmed: { type: Boolean, required: true }
  },
  passwordRecovery: {
    recoveryCode: { type: String, default: null },
    expirationDate: { type: Date, default: null }
  },
  refreshToken: { type: String, default: null }
})

export const UserDbModel = mongoose.model('User', UserDbModelSchema, 'users')

