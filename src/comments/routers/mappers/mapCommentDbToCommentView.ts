import { CommentDbModel } from '../../types/CommentDbModel';
import { CommentViewModel } from '../../types/CommentViewModel';

export const mapCommentDbToCommentView = (
  dbModel: CommentDbModel,
): CommentViewModel => {
  return {
    id: dbModel._id.toString(),
    content: dbModel.content,
    commentatorInfo: {
      userId: dbModel.commentatorInfo.userId,
      userLogin: dbModel.commentatorInfo.userLogin,
    },
    createdAt: dbModel.createdAt,
  };
};
