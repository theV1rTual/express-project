import express, { Express } from 'express';
import { routersPaths } from './core/paths/paths';
import { blogsRouter } from './blogs/routers/blogs.router';
import { testingRouter } from './testing/routers/testing.router';
import { postRouter } from './posts/routers/post.router';
import { usersRouter } from './users/routers/users.router';
import { authRouter } from './auth/routers/auth.router';
import { commentsRouter } from './comments/routers/comments.router';
import cookieParser from 'cookie-parser';
import { securityDevicesRouter } from './securityDevices/routers/securityDevices.router';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).send('Server is alive');
  });

  app.use(cookieParser());
  app.set('trust proxy', true);

  app.use(routersPaths.testing, testingRouter);
  app.use(routersPaths.posts, postRouter);
  app.use(routersPaths.blogs, blogsRouter);
  app.use(routersPaths.users, usersRouter);
  app.use(routersPaths.common, authRouter);
  app.use(routersPaths.comments, commentsRouter);
  app.use(routersPaths.securityDevices, securityDevicesRouter);
};
