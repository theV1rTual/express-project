import { Post } from '../types/Post';
import { db } from '../../db/in-memory.db';
import { PostInputDto } from '../dto/post.input-dto';

export const postsRepository = {
  findAll(): Post[] {
    return db.posts;
  },

  findById(id: string): Post | null {
    return db.posts.find((post: Post) => post.id === id) ?? null;
  },

  create(newPost: Post): Post {
    db.posts.push(newPost);

    return newPost;
  },

  update(id: string, dto: PostInputDto): void {
    const post = db.posts.find((post: Post) => post.id === id);

    if (!post) {
      throw new Error('Post not exists');
    }

    post.title = dto.title;
    post.blogId = dto.blogId;
    post.blogName = dto.blogName;
    post.content = dto.content;
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;

    return;
  },

  delete(id: string): void {
    const index = db.posts.findIndex((post: Post) => post.id === id);

    if (index === -1) {
      throw new Error('Post not exists');
    }

    db.posts.splice(index, 1);
    return;
  },
};
