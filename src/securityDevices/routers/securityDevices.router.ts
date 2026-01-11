import { Router } from 'express';
import { getSecurityDevicesHandler } from './handlers/get-security-handlers.handler';
import { deleteAllSecurityDevicesHandler } from './handlers/delete-all-security-devices.handler';
import { deviceSecurityDeviceHandler } from './handlers/device-security-device.handler';

export const securityDevicesRouter = Router({});

securityDevicesRouter
  .get('', getSecurityDevicesHandler)
  .delete('', deleteAllSecurityDevicesHandler)
  .delete('/:deviceId', deviceSecurityDeviceHandler);
