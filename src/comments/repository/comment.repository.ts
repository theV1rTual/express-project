import { CommentQueryInput } from '../routers/input/comment-query.input';
import { CommentDbModel } from '../types/CommentDbModel';
import { commentsCollection } from '../../db/mongo.db';
import { ObjectId } from 'mongodb';
import { mapCommentDbToCommentView } from '../routers/mappers/mapCommentDbToCommentView';
import { CommentInputDto } from '../dto/comment.input-dto';
import { CommentViewModel } from '../types/CommentViewModel';

export const commentRepository = {
  async findAll(
    queryDto: CommentQueryInput,
    postId: string,
  ): Promise<{ items: CommentDbModel[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const mongoSortDirection = sortDirection === 'asc' ? 1 : -1;

    const items = await commentsCollection
      .find({ postId })
      .sort({ [sortBy]: mongoSortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await commentsCollection.countDocuments();

    return { items, totalCount };
  },

  async findById(id: string) {
    const commentDb = await commentsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!commentDb) {
      return null;
    }
    return mapCommentDbToCommentView(commentDb);
  },

  async create(newComment: CommentInputDto): Promise<CommentViewModel> {
    const docToInsert: CommentDbModel = {
      _id: new ObjectId(),
      postId: newComment.postId,
      commentatorInfo: {
        userId: newComment.commentatorInfo.userId,
        userLogin: newComment.commentatorInfo.userLogin,
      },
      content: newComment.content,
      createdAt: new Date(),
    };

    await commentsCollection.insertOne(docToInsert);
    return mapCommentDbToCommentView(docToInsert);
  },

  async update(id: string, dto: { content: string }): Promise<boolean> {
    const comment = await commentsCollection.findOne({ _id: new ObjectId(id) });

    if (!comment) {
      throw new Error('Comment not exists');
    }

    const updatedResult = await commentsCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          content: dto.content,
        },
      },
    );

    return updatedResult.modifiedCount === 1;
  },

  async delete(id: string) {
    const deletedResult = await commentsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return deletedResult.deletedCount === 1;
  },

  async clear(): Promise<void> {
    await commentsCollection.deleteMany({});
  },
};
