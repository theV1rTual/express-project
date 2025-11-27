import { BlogViewModel } from '../blogs/types/BlogViewModel';
import { PostViewModel } from '../posts/types/PostViewModel';

export const db: { posts: PostViewModel[]; blogs: BlogViewModel[] } = {
  posts: [],
  blogs: [],
};
