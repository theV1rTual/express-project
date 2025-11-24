import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';

export async function getBlogsListHandler(req: Request, res: Response) {
  const blogs = await blogsRepository.findAll();
  res.send(blogs);
}
