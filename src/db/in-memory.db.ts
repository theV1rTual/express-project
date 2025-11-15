import { Blog } from '../blogs/types/Blog';
import { Post } from '../posts/types/Post';

export const db: { posts: Post[]; blogs: Blog[] } = {
  posts: [],
  blogs: [],
};
