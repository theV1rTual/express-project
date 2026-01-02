import { CommentatorInfo } from './CommentDbModel';

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: Date;
};
