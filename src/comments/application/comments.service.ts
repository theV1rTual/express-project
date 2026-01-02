import { CommentQueryInput } from '../routers/input/comment-query.input';
import { commentRepository } from '../repository/comment.repository';

export const CommentsService = {
  async findMany(queryDto: CommentQueryInput, postId: string) {
    return commentRepository.findAll(queryDto, postId);
  },
};
