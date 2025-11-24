import * as process from 'process';

export const SETTINGS = {
  PORT: process.env.PORT || 5003,
  MONGO_URL:
    process.env.MONGO_URL ||
    'mongodb+srv://arystandev_db_user:tB37xiQA2HIAaIi5@cluster0.bjssuw0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  DB_NAME: process.env.DB_NAME || 'database',
};
