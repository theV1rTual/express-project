import { SecurityDevicesDbModel } from '../../types/SecurityDevicesDbModel';

export const mapSecurityDevicesDbToView = (dbModel: SecurityDevicesDbModel) => {
  return {
    ip: dbModel.ip,
    title: dbModel.title,
    lastActiveDate: dbModel.lastActiveDate,
    deviceId: dbModel.deviceId,
  };
};
