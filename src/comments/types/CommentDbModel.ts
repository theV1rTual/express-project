import { ObjectId } from 'mongodb';

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
};
