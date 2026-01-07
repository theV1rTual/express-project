import { securityDevicesCollection } from '../../db/mongo.db';

export const securityDevicesRepository = {
  /* Find security devices for specific user*/
  async findAll() {
    const items = await securityDevicesCollection.find();

    const totalCount = await securityDevicesCollection.countDocuments();
  },
};
