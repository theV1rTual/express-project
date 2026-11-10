import 'reflect-metadata'
import { Container, } from 'inversify'
import { PostsRepository } from './posts/repositories/posts.repository';
import { PostsService } from './posts/application/posts.service';
import { PostController } from './posts/routers/handlers/posts.controller';

export const container = new Container()

container.bind(PostsRepository).toSelf();
container.bind(PostsService).toSelf();
container.bind(PostController).toSelf();