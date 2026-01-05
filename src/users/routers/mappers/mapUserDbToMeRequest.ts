import { UserDbModel } from '../../types/UserDbModel';

export const mapUserDbToMeRequest = (dbModel: UserDbModel) => {
  return {
    email: dbModel.email,
    login: dbModel.login,
    userId: dbModel._id.toString(),
  };
};
