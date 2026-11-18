import { PostDbModel } from '../../types/PostDbModel';
import { PostViewModel } from '../../types/PostViewModel';

export const mapPostDbToPostView = (
  dbModel: PostDbModel,
  viewerId?: string,
): PostViewModel => {
  const reactions = dbModel.likes ?? [];
  const likes = reactions.filter((reaction) => reaction.status === 'Like');
  return {
    id: dbModel._id.toString(),
    blogName: dbModel.blogName,
    blogId: dbModel.blogId,
    content: dbModel.content,
    shortDescription: dbModel.shortDescription,
    createdAt: dbModel.createdAt,
    title: dbModel.title,
    extendedLikesInfo: {
      likesCount: likes.length,
      dislikesCount: reactions.filter(
        (reaction) => reaction.status === 'Dislike',
      ).length,
      myStatus:
        reactions.find((reaction) => reaction.userId === viewerId)?.status ??
        'None',
      newestLikes: [...likes]
        .sort(
          (a, b) =>
            b.addedAt.getTime() - a.addedAt.getTime() ||
            a.userId.localeCompare(b.userId),
        )
        .slice(0, 3)
        .map(({ addedAt, userId, login }) => ({
          addedAt: addedAt.toISOString(),
          userId,
          login,
        })),
    },
  };
};
