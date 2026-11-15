import { Request, Response } from 'express';
import { HttpStatuses } from "../../../core/types/http-statuses";
import { commentRepository } from "../../repository/comment.repository";

export async function updateCommentLikeHandler(
    req: Request<{ id: string }, {}, { likeStatus: 'Like' | 'Dislike' }>,
    res: Response
) {
    const id = req.params.id;
    const comment = await commentRepository.findById(id);
    const userId = req.user?.id

    if (!userId) {
        res
            .status(HttpStatuses.BAD_REQUEST)
            .send([{ field: 'id', message: 'User not found' }]);

        return;
    }

    if (!comment) {
        res
            .status(HttpStatuses.NOT_FOUND)
            .send([{ field: 'id', message: 'Comment not found' }]);

        return;
    }

    const isUpdated = await commentRepository.updateLikeForComment(id, userId, req.body.likeStatus);

    if (!isUpdated) {
        res.sendStatus(HttpStatuses.NOT_FOUND);
        return;
    }

    res.sendStatus(HttpStatuses.NO_CONTENT);



}