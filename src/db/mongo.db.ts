import { Collection, Db, MongoClient } from 'mongodb';
import { SETTINGS } from '../core/settings/settings';
import { BlogDbModel } from '../blogs/types/BlogDbModel';
import { PostDbModel } from '../posts/types/PostDbModel';

const BLOGS_COLLECTION_NAME = 'blogs';
const POSTS_COLLECTION_NAME = 'posts';

export let client: MongoClient;
export let blogsCollection: Collection<BlogDbModel>;
export let postsCollection: Collection<PostDbModel>;

export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  blogsCollection = db.collection<BlogDbModel>(BLOGS_COLLECTION_NAME);
  postsCollection = db.collection<PostDbModel>(POSTS_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log('Connected to the database');
  } catch (e) {
    await client.close();
    throw new Error('Database not connected');
  }
}
