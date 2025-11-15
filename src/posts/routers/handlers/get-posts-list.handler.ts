import { Response, Request } from 'express';
import { postsRepository } from '../../repositories/posts.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';

export function getPostsListHandler(req: Request, res: Response) {
  const posts = postsRepository.findAll();
  res.status(HttpStatuses.OK).send(posts);
}
