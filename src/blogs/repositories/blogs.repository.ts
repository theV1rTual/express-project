import { Blog } from '../types/Blog';
import { db } from '../../db/in-memory.db';
import { BlogInputDto } from '../dto/blog.input-dto';

export const blogsRepository = {
  findAll(): Blog[] {
    return db.blogs;
  },

  findById(id: number): Blog | null {
    return db.blogs.find((blog: Blog) => blog.id === id) ?? null;
  },

  create(newBlog: Blog): Blog {
    db.blogs.push(newBlog);

    return newBlog;
  },

  update(id: number, dto: BlogInputDto): void {
    const blog = db.blogs.find((blog) => blog.id === id);

    if (!blog) {
      throw new Error('Blog not exists');
    }

    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;

    return;
  },
};
