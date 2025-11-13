import express, { Express } from 'express';
import { BLOGS_PATH } from './core/paths/paths';
import { blogsRouter } from './blogs/routers/blogs.router';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).send('Server is alive');
  });

  app.use(BLOGS_PATH, blogsRouter);
};
