import 'reflect-metadata'
import { Container, } from 'inversify'
import { PostsRepository } from './posts/repositories/posts.repository';
import { PostsService } from './posts/application/posts.service';
import { PostController } from './posts/routers/handlers/posts.controller';
import { UsersRepository } from './users/infra/users.repository';
import { UserService } from './users/application/user.service';
import { UsersController } from './users/routers/handlers/users.controller';

export const container = new Container()

container.bind(PostsRepository).toSelf();
container.bind(PostsService).toSelf();
container.bind(PostController).toSelf();

container.bind(UsersRepository).toSelf();
container.bind(UserService).toSelf();
container.bind(UsersController).toSelf();