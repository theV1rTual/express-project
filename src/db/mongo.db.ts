import { Collection, Db, MongoClient } from 'mongodb';
import { SETTINGS } from '../core/settings/settings';
import { BlogDbModel } from '../blogs/types/BlogDbModel';
import { PostDbModel } from '../posts/types/PostDbModel';
import { UserDbModel } from '../users/types/UserDbModel';
import { CommentDbModel } from '../comments/types/CommentDbModel';
import { RefreshTokenDb } from '../auth/types/RefreshTokenDb.model';
import { SecurityDevicesDbModel } from '../securityDevices/types/SecurityDevicesDbModel';

const BLOGS_COLLECTION_NAME = 'blogs';
const POSTS_COLLECTION_NAME = 'posts';
const USERS_COLLECTION_NAME = 'users';
const COMMENTS_COLLECTION_NAME = 'comments';
const REFRESH_TOKEN_COLLECTION_NAME = 'refreshTokens';
const SECURITY_DEVICES_COLLECTION_NAME = 'securityDevices';

export let client: MongoClient;
export let blogsCollection: Collection<BlogDbModel>;
export let postsCollection: Collection<PostDbModel>;
export let usersCollection: Collection<UserDbModel>;
export let commentsCollection: Collection<CommentDbModel>;
export let refreshTokensCollection: Collection<RefreshTokenDb>;
export let securityDevicesCollection: Collection<SecurityDevicesDbModel>;

export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  blogsCollection = db.collection<BlogDbModel>(BLOGS_COLLECTION_NAME);
  postsCollection = db.collection<PostDbModel>(POSTS_COLLECTION_NAME);
  usersCollection = db.collection<UserDbModel>(USERS_COLLECTION_NAME);
  commentsCollection = db.collection<CommentDbModel>(COMMENTS_COLLECTION_NAME);
  refreshTokensCollection = db.collection<RefreshTokenDb>(
    REFRESH_TOKEN_COLLECTION_NAME,
  );
  securityDevicesCollection = db.collection<SecurityDevicesDbModel>(
    SECURITY_DEVICES_COLLECTION_NAME,
  );

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('Connected to the database');
  } catch (e) {
    await client.close();
    throw new Error('Database not connected');
  }
}
