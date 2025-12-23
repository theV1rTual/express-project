import express, { Express } from 'express';
import {
  AUTH_PATH,
  BLOGS_PATH,
  POSTS_PATH,
  TESTING_PATH,
  USERS_PATH,
} from './core/paths/paths';
import { blogsRouter } from './blogs/routers/blogs.router';
import { testingRouter } from './testing/routers/testing.router';
import { postRouter } from './posts/routers/post.router';
import { usersRouter } from './users/routers/users.router';
import { authRouter } from './auth/routers/auth.router';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).send('Server is alive');
  });
  app.use(TESTING_PATH, testingRouter);
  app.use(POSTS_PATH, postRouter);
  app.use(BLOGS_PATH, blogsRouter);
  app.use(USERS_PATH, usersRouter);
  app.use(AUTH_PATH, authRouter);
};
