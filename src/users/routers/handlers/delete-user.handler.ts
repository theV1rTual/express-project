import { Request, Response } from 'express';
import { usersRepository } from '../../repositories/users.repository';
import { HttpStatuses } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';

export async function deleteUserHandler(req: Request, res: Response) {
  const id = req.params.id;
  const user = usersRepository.findById(id);

  if (!user) {
    res
      .status(HttpStatuses.NOT_FOUND)
      .send(createErrorMessages([{ field: 'id', message: 'user not found' }]));
    return;
  }

  const isDeleted = await usersRepository.delete(id);
  if (!isDeleted) {
    res.sendStatus(HttpStatuses.NOT_FOUND);
    return;
  }

  res.sendStatus(HttpStatuses.CREATED);
}
