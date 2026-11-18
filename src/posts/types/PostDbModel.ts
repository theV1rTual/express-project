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
  likes: { userId: string, status: 'Like' | 'Dislike', addedAt: Date, login: string }[]
};

export const PostDbModelSchema = new Schema({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String, required: true },
  likes: {
    type: [{
      _id: false,
      userId: { type: String, required: true },
      status: { type: String, enum: ['Like', 'Dislike'], required: true },
      addedAt: { type: Date, required: true },
      login: { type: String, required: true }
    }],
    default: []
  }
})

export const PostDbModel = mongoose.model('Post', PostDbModelSchema, 'posts')

