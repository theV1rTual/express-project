import { Request } from 'express';
import { IdType } from './id';

export type RequestWithBody<B> = Request<{}, {}, B>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type RequestWithParams<P> = Request<P>;
export type RequestWithUserId<U extends IdType> = Request<{}, {}, {}, {}, U>;
