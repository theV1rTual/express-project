import { CommentatorInfo } from '../types/CommentDbModel';

export type CommentInputDto = {
  content: string;
  postId: string;
  commentatorInfo: CommentatorInfo;
};
