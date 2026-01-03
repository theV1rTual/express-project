import { Request, Response } from 'express';
import { CommentInputDto } from '../../dto/comment.input-dto';
import { CommentViewModel } from '../../types/CommentViewModel';
import { commentRepository } from '../../repository/comment.repository';
import { usersRepository } from '../../../users/repositories/users.repository';
import { postsRepository } from '../../../posts/repositories/posts.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';

export async function createCommentHandler(
  req: Request<{ postId: string }, {}, CommentInputDto>,
  res: Response,
) {
  const postId = req.params.postId;
  const post = await postsRepository.findById(postId);
  if (!post) {
    return res.sendStatus(HttpStatuses.NOT_FOUND);
  }

  const userLogin = await usersRepository.findById(req.user?.id as string);
  if (!userLogin) {
    return res.sendStatus(HttpStatuses.NOT_FOUND);
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
