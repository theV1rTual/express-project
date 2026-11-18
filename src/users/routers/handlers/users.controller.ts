import { Request, Response } from 'express';
import { inject } from "inversify";
import { UserService } from "../../application/user.service";
import { UserInputDto } from '../../dto/user.input-dto';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { matchedData } from 'express-validator';
import { UserQueryInput } from '../input/user-query.input';
import { setDefaultSortAndPagination } from '../../../core/helpers/set-default-sort-and-pagination';
import { mapToUserListPaginatedOutput } from '../mappers/mapToUserListPaginatedOutput.utils';
import { errorsHandler } from '../../../core/errors/errors.handler';

export class UsersController {
    constructor(
        @inject(UserService)
        private usersService: UserService
    ) { }

    async createUser(req: Request<{}, {}, UserInputDto>, res: Response,) {

        const newUser: UserInputDto = {
            email: req.body.email,
            login: req.body.login,
            password: req.body.password,
        };

        let createdUser = await this.usersService.createUser(newUser);

        if ('field' in createdUser) {
            res
                .status(HttpStatuses.BAD_REQUEST)
                .send(createErrorMessages([createdUser]));
            return;
        }

        res.status(HttpStatuses.CREATED).send(createdUser);
    }

    async deleteUser(req: Request<{ id: string }>, res: Response) {

        const isDeleted = await this.usersService.deleteUser(req.params.id);
        if (!isDeleted) {
            res.sendStatus(HttpStatuses.NOT_FOUND);
            return;
        }

        res.sendStatus(HttpStatuses.NO_CONTENT);
    }

    async getUsers(req: Request, res: Response) {
        try {
            const sanitizedQuery = matchedData<UserQueryInput>(req, {
                locations: ['query'],
                includeOptionals: true,
            });

            const queryInput = setDefaultSortAndPagination(sanitizedQuery);
            const { items, totalCount } = await this.usersService.findMany(queryInput);

            const usersListOutput = mapToUserListPaginatedOutput(items, {
                page: queryInput.pageNumber,
                pageSize: queryInput.pageSize,
                totalCount,
            });

            res.send(usersListOutput);
        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }
}