import { BlogViewModel } from '../blogs/types/BlogViewModel';
import { Post } from '../posts/types/Post';

export const db: { posts: Post[]; blogs: BlogViewModel[] } = {
  posts: [],
  blogs: [],
};
