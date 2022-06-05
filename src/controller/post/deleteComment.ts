import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Comment } from '../../entity/comment/Comment'
import { Post } from '../../entity/post/Post'

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    const { jwtPayload } = req
    const { id } = req.params

    const commentRepository = db.getRepository(Comment)

    try {
        const comment = await commentRepository
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.post', 'post')
            .where('comment.id = :comment_id', { comment_id: id })
            .andWhere('comment.author_id = :author_id', { author_id: jwtPayload.id })
            .getOne()

        if (!comment) {
            const customError = new ErrorResponse(404, 'comment not found')
            return next(customError)
        }

        const deleteResponse = await db
            .createQueryBuilder()
            .delete()
            .from(Comment)
            .where('comment.id = :id', { id })
            .andWhere('comment.author_id = :author_id', { author_id: jwtPayload.id })
            .execute()

        const updateResponse = await db
            .createQueryBuilder()
            .update(Post)
            .set({
                comments_count: () => 'comments_count - 1'
            })
            .where('id = :id', { id: comment.post.id })
            .execute()

        if (deleteResponse.affected === 0 || updateResponse.affected === 0) {
            const customError = new ErrorResponse(500, 'comment not deleted')
            return next(customError)
        }

        res.customSuccess(200, 'comment deleted successfully')
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to delete comment', err)
        return next(customError)
    }
}
