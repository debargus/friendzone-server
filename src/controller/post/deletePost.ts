import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Post } from '../../entity/post/Post'

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const { jwtPayload } = req
    const { id } = req.params

    try {
        const deleteResponse = await db
            .createQueryBuilder()
            .delete()
            .from(Post)
            .where('post.id = :id', { id })
            .andWhere('post.author_id = :author_id', { author_id: jwtPayload.id })
            .execute()

        if (deleteResponse.affected === 0) {
            const customError = new ErrorResponse(500, 'post not deleted')
            return next(customError)
        }

        res.customSuccess(200, 'post deleted successfully')
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to delete post', err)
        return next(customError)
    }
}
