import { Request, Response } from 'express';
import { PostInputDto } from '../../../posts/dto/post.input-dto';
import { postsRepository } from '../../../posts/repositories/posts.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';

export async function createPostForBlogHandler(
  req: Request<{}, {}, Omit<PostInputDto, 'blogId'>>,
  res: Response,
) {
  const newPost: PostInputDto = {
    title: req.body.title,
    blogId: req.query.id as string,
    content: req.body.content,
    shortDescription: req.body.shortDescription,
  };

  const createdPost = await postsRepository.create(newPost);
  res.status(HttpStatuses.CREATED).send(createdPost);
}
