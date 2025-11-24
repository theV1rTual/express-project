import { Response, Request } from 'express';
import { postsRepository } from '../../repositories/posts.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';

export async function getPostsListHandler(req: Request, res: Response) {
  const posts = await postsRepository.findAll();
  res.status(HttpStatuses.OK).send(posts);
}
