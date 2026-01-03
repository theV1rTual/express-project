import { Request, Response } from 'express';
import { CommentInputDto } from '../../dto/comment.input-dto';
import { CommentViewModel } from '../../types/CommentViewModel';
import { commentRepository } from '../../repository/comment.repository';
import { usersRepository } from '../../../users/repositories/users.repository';
import { postsRepository } from '../../../posts/repositories/posts.repository';
import { ResultStatus } from '../../../core/result /resultCode';
import { HttpStatuses } from '../../../core/types/http-statuses';

export async function createCommentHandler(
  req: Request<{ postId: string }, {}, CommentInputDto>,
  res: Response,
) {
  const postId = req.params.postId;
  const post = await postsRepository.findById(postId);
  if (!post) {
    return {
      status: ResultStatus.NotFound,
      errorMessage: 'Post not found',
      extensions: [{ field: 'postId', message: 'Post not found' }],
      data: null,
    };
  }

  const userLogin = await usersRepository.findById(req.user?.id as string);
  if (!userLogin) {
    return {
      status: ResultStatus.NotFound,
      errorMessage: 'user not found',
      extensions: [{ field: 'userId', message: 'User not found' }],
      data: null,
    };
  }

  const newComment: CommentInputDto = {
    content: req.body.content,
    postId,
    commentatorInfo: {
      userId: req.user?.id as string,
      userLogin: userLogin?.login as string,
    },
  };

  let createdComment: CommentViewModel =
    await commentRepository.create(newComment);

  res.status(HttpStatuses.CREATED).send(createdComment);
}
