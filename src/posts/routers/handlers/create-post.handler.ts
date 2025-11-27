import { Request, Response } from 'express';
import { PostInputDto } from '../../dto/post.input-dto';
import { postsRepository } from '../../repositories/posts.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';

export async function createPostHandler(
  req: Request<{}, {}, PostInputDto>,
  res: Response,
) {
  const newPost: PostInputDto = {
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
  };

  await postsRepository.create(newPost);
  res.status(HttpStatuses.CREATED).send(newPost);
}
