import { Request, Response, Router } from 'express';
import { db } from '../../db/in-memory.db';
import { HttpStatuses } from '../../core/types/http-statuses';

export const testingRouter = Router({});

testingRouter.delete('/all-data', (req: Request, res: Response) => {
  db.blogs = [];
  db.posts = [];

  res.sendStatus(HttpStatuses.NO_CONTENT);
});
