import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type CommentDbModel = {
  _id: ObjectId;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: Date;
  postId: string;
  likes: { userId: string, status: 'Like' | 'Dislike' }[]
};

export const CommentDbModelSchema = new Schema<CommentDbModel>({
  content: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  createdAt: { type: Date, required: true },
  postId: { type: String, required: true },
  likes: {
    type: [{
      _id: false,
      userId: { type: String, required: true },
      status: { type: String, enum: ['Like', 'Dislike'], required: true }
    }],
    default: []
  }
})
