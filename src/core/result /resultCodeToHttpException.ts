import { ResultStatus } from './resultCode';
import { HttpStatuses } from '../types/http-statuses';

export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
  switch (resultCode) {
    case ResultStatus.BadRequest:
      return HttpStatuses.BAD_REQUEST;
    case ResultStatus.Forbidden:
      return HttpStatuses.FORBIDDEN;
    default:
      return HttpStatuses.INTERNAL_SERVER_ERROR;
  }
};
