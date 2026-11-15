import { ObjectId } from 'mongodb';
import mongoose, { Schema } from 'mongoose';

export type PostDbModel = {
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export const PostDbModelSchema = new Schema({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String, required: true }
})

export const PostDbModel = mongoose.model('Post', PostDbModelSchema, 'posts')

