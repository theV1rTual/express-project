import { PostDbModel } from '../../types/PostDbModel';
import { PostViewModel } from '../../types/PostViewModel';

export const mapPostDbToPostView = (dbModel: PostDbModel): PostViewModel => {
  return {
    id: dbModel._id.toString(),
    blogName: dbModel.blogName,
    blogId: dbModel.blogId,
    content: dbModel.content,
    shortDescription: dbModel.shortDescription,
    createdAt: dbModel.createdAt,
    title: dbModel.title,
  };
};
