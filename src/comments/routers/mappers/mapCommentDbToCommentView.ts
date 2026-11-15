import { CommentDbModel } from '../../types/CommentDbModel';
import { CommentViewModel } from '../../types/CommentViewModel';

export const mapCommentDbToCommentView = (
  dbModel: CommentDbModel,
  viewerId?: string
): CommentViewModel => {

  const reactions = dbModel.likes ?? [];

  return {
    id: dbModel._id.toString(),
    content: dbModel.content,
    commentatorInfo: {
      userId: dbModel.commentatorInfo.userId,
      userLogin: dbModel.commentatorInfo.userLogin,
    },
    createdAt: dbModel.createdAt,
    likesInfo: {
      likesCount: reactions.filter(reaction => reaction.status === 'Like').length,
      dislikesCount: reactions.filter(reaction => reaction.status === 'Dislike').length,
      myStatus: reactions.find(reaction => reaction.userId === viewerId)?.status ?? 'None',
    },
  };
};
