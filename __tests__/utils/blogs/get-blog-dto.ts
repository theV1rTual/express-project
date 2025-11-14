import { BlogInputDto } from '../../../src/blogs/dto/blog.input-dto';

export function getBlogDto(): BlogInputDto {
  return {
    name: 'new blog',
    websiteUrl: 'new websiteUrl',
    description: 'new description',
  };
}
