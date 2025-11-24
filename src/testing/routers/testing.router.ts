import { Request, Response, Router } from 'express';
import { HttpStatuses } from '../../core/types/http-statuses';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import { postsRepository } from '../../posts/repositories/posts.repository';

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
  await blogsRepository.clear();
  await postsRepository.clear();

  res.sendStatus(HttpStatuses.NO_CONTENT);
});
