import { Router } from 'express';
import { getBlogsListHandler } from './handlers/get-blogs-list.handler';

export const blogsRouter = Router({});

blogsRouter.get('', getBlogsListHandler);

// .get('/', getBlogsListHandler);
