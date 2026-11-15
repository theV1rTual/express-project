import { Collection, Db, MongoClient } from 'mongodb';
import { SETTINGS } from '../core/settings/settings';
import { CommentDbModel } from '../comments/types/CommentDbModel';
import { RefreshTokenDb } from '../auth/types/RefreshTokenDb.model';
import { SecurityDevicesDbModel } from '../securityDevices/types/SecurityDevicesDbModel';
import { ApiRequestLogDbModel } from '../core/types/api-request-log';
import mongoose from 'mongoose';

const BLOGS_COLLECTION_NAME = 'blogs';
const POSTS_COLLECTION_NAME = 'posts';
const USERS_COLLECTION_NAME = 'users';
const COMMENTS_COLLECTION_NAME = 'comments';
const REFRESH_TOKEN_COLLECTION_NAME = 'refreshTokens';
const SECURITY_DEVICES_COLLECTION_NAME = 'securityDevices';
const API_REQUEST_LOG = 'apiRequestLog';

export let client: MongoClient;
export let commentsCollection: Collection<CommentDbModel>;
export let refreshTokensCollection: Collection<RefreshTokenDb>;
export let securityDevicesCollection: Collection<SecurityDevicesDbModel>;
export let apiRequestLogCollection: Collection<ApiRequestLogDbModel>;

export async function runDB(url: string): Promise<void> {

  await mongoose.connect(url, {
    dbName: SETTINGS.DB_NAME,
  })

  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  commentsCollection = db.collection<CommentDbModel>(COMMENTS_COLLECTION_NAME);
  refreshTokensCollection = db.collection<RefreshTokenDb>(
    REFRESH_TOKEN_COLLECTION_NAME,
  );
  securityDevicesCollection = db.collection<SecurityDevicesDbModel>(
    SECURITY_DEVICES_COLLECTION_NAME,
  );
  apiRequestLogCollection =
    db.collection<ApiRequestLogDbModel>(API_REQUEST_LOG);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('Connected to the database');
  } catch (e) {
    await client.close();
    throw new Error('Database not connected');
  }
}
