import * as process from 'process';

export const SETTINGS = {
  PORT: process.env.PORT || 5003,
  MONGO_URL:
    process.env.MONGO_URL ||
    'mongodb+srv://arystandev_db_user:tB37xiQA2HIAaIi5@cluster0.bjssuw0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  DB_NAME: process.env.DB_NAME || 'database',
  AC_TIME: 10,
  RF_TIME: 20,
  AC_SECRET:
    'efcf780e4db6d154732e9964447798ea0d6e381fbba8f6db742c034eb917417cd067c1f87df0a2d86a0fbe4dc649c47dfcdc151b148ab80c9559ee15feb442f4',
  EMAIL: 'arystandev@gmail.com',
  EMAIL_PASS: 'mskq xfnt edyu mrzr',
};
