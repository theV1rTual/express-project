import { ObjectId } from 'mongodb';
import mongoose, { Schema } from 'mongoose';

export type BlogDbModel = {
  _id: ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};

export const BlogDbModelSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: Date, required: true },
  isMembership: { type: Boolean, required: true },
})

export const BlogDbModel = mongoose.model('Blog', BlogDbModelSchema, 'blogs')

