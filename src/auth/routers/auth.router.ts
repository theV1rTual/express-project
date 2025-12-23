import { Router } from 'express';
import { authHandler } from './handlers/auth.handler';

export const authRouter = Router({});

authRouter.post('/login', authHandler);
