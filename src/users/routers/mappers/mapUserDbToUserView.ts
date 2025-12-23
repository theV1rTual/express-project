import { UserDbModel } from '../../types/UserDbModel';
import { UserViewModel } from '../../types/UserViewModel';

export const mapUserDbToUserView = (dbModel: UserDbModel): UserViewModel => {
  return {
    id: dbModel._id.toString(),
    login: dbModel.login,
    email: dbModel.email,
    createdAt: dbModel.createdAt,
  };
};
