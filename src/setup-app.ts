import express, { Express } from 'express';
import { BLOGS_PATH, TESTING_PATH } from './core/paths/paths';
import { blogsRouter } from './blogs/routers/blogs.router';
import { testingRouter } from './testing/routers/testing.router';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).send('Server is alive');
  });
  app.use(TESTING_PATH, testingRouter);
  app.use(BLOGS_PATH, blogsRouter);
};
