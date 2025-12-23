import { Request, Response } from 'express';
import { UserInputDto } from '../../dto/user.input-dto';
import { userService } from '../../application/user.service';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';

export async function createUserHandler(
  req: Request<{}, {}, UserInputDto>,
  res: Response,
) {
  const newUser: UserInputDto = {
    email: req.body.email,
    login: req.body.login,
    password: req.body.password,
  };

  let createdUser = await userService.createUser(newUser);
  if (!createdUser) {
    res
      .status(HttpStatuses.BAD_REQUEST)
      .send(
        createErrorMessages([
          { field: 'email', message: 'email should be unique' },
        ]),
      );
    return;
  }
  res.status(HttpStatuses.CREATED).send(createdUser);
}
