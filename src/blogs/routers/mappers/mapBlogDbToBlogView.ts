import { BlogDbModel } from '../../types/BlogDbModel';
import { BlogViewModel } from '../../types/BlogViewModel';

export const mapBlogDbToViewModel = (dbModel: BlogDbModel): BlogViewModel => {
  return {
    id: dbModel._id.toString(),
    name: dbModel.name,
    description: dbModel.description,
    websiteUrl: dbModel.websiteUrl,
    createdAt: dbModel.createdAt,
    isMembership: dbModel.isMembership,
  };
};
