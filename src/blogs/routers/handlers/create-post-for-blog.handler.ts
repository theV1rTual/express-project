import { Request, Response } from 'express';
import { PostInputDto } from '../../../posts/dto/post.input-dto';
import { postsRepository } from '../../../posts/repositories/posts.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { ObjectId } from 'mongodb';

type Params = { id: string };

export async function createPostForBlogHandler(
  req: Request<Params, {}, Omit<PostInputDto, 'blogId'>>,
  res: Response,
) {
  const blogId = req.params.id;

  if (!ObjectId.isValid(blogId)) {
    res.sendStatus(HttpStatuses.NOT_FOUND);
    return;
  }

  const newPost: PostInputDto = {
    title: req.body.title,
    blogId,
    content: req.body.content,
    shortDescription: req.body.shortDescription,
  };

  const createdPost = await postsRepository.create(newPost);
  if (!createdPost) {
    return res.sendStatus(HttpStatuses.NOT_FOUND);
  }
  res.status(HttpStatuses.CREATED).send(createdPost);
}
