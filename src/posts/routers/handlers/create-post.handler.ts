import { Request, Response } from 'express';
import { PostInputDto } from '../../dto/post.input-dto';
import { db } from '../../../db/in-memory.db';
import { Post } from '../../types/Post';
import { postsRepository } from '../../repositories/posts.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';

export function createPostHandler(
  req: Request<{}, {}, PostInputDto>,
  res: Response,
) {
  const newPost: Post = {
    id: db.posts.length ? db.posts[db.posts.length - 1].id + 1 : '1',
    shortDescription: req.body.shortDescription,
    title: req.body.title,
    content: req.body.content,
    blogId: req.body.blogId,
    blogName: req.body.blogName,
  };

  postsRepository.create(newPost);
  res.status(HttpStatuses.CREATED).send(newPost);
}
