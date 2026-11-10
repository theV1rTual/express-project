import { Request, Response } from 'express';
import { PostsRepository } from '../../repositories/posts.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { inject } from 'inversify';
import { PostsService } from '../../application/posts.service';
import { PostInputDto } from '../../dto/post.input-dto';
import { matchedData } from 'express-validator';
import { setDefaultSortAndPagination } from '../../../core/helpers/set-default-sort-and-pagination';
import { PostQueryInput } from '../input /post-query.input';
import { mapToBlogListPaginatedOutput } from '../mappers/mapToPostListPaginatedOutput.utils';
import { errorsHandler } from '../../../core/errors/errors.handler';

export class PostController {
  constructor(
    @inject(PostsService)
    private postsService: PostsService
  ) { }

  async getPost(req: Request<{ id: string }>, res: Response) {
    const id = req.params.id;
    const post = await this.postsService.findById(id);

    if (!post) {
      res
        .status(HttpStatuses.NOT_FOUND)
        .send(createErrorMessages([{ field: 'id', message: 'Post not exists' }]));
      return;
    }

    res.status(HttpStatuses.OK).send(post);
  }

  async getPostsList(req: Request, res: Response) {
    try {
      const sanitizedQuery = matchedData<PostQueryInput>(req, {
        locations: ['query'],
        includeOptionals: true,
      });

      const blogId = req.params.id;
      const queryInput = setDefaultSortAndPagination({
        ...sanitizedQuery,
        ...(blogId ? { blogId } : {}),
      });
      const result = await this.postsService.findMany(queryInput);
      if (!result) return res.sendStatus(HttpStatuses.NOT_FOUND);

      const postsListOutput = mapToBlogListPaginatedOutput(result.items, {
        page: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount: result.totalCount,
      });

      res.send(postsListOutput);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async createPost(req: Request<{}, {}, PostInputDto>, res: Response,) {
    const newPost: PostInputDto = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
    };

    const createdPost = await this.postsService.create(newPost);
    if (!createdPost) {
      res.sendStatus(404);
      return;
    }
    res.status(HttpStatuses.CREATED).send(createdPost);
  }

  async delete(req: Request<{ id: string }>, res: Response) {
    const id = req.params.id;
    const post = await this.postsService.findById(id);

    if (!post) {
      res
        .status(HttpStatuses.NOT_FOUND)
        .send(createErrorMessages([{ field: 'id', message: 'Post not exists' }]));
      return;
    }

    const isDeleted = await this.postsService.delete(id);
    if (!isDeleted) {
      res.sendStatus(404); // NOT_FOUND
      return;
    }

    res.sendStatus(204); // NO_CONTENT
  }

  async update(req: Request<{ id: string }, {}, PostInputDto>, res: Response) {
    const id = req.params.id;
    const post = await this.postsService.findById(id);

    if (!post) {
      res
        .status(HttpStatuses.NOT_FOUND)
        .send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));

      return;
    }

    const isUpdated = await this.postsService.update(id, req.body);
    if (!isUpdated) {
      res.sendStatus(404);
      return;
    }

    res.sendStatus(204);
  }
}