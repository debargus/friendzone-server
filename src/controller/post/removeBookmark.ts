import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Bookmark } from '../../entity/bookmark/Bookmark'

export const removeBookmark = async (req: Request, res: Response, next: NextFunction) => {
    const { jwtPayload } = req
    const { id: post_id } = req.params

    try {
        const deleteResponse = await db
            .createQueryBuilder()
            .delete()
            .from(Bookmark)
            .where('bookmark.post_id = :post_id', { post_id })
            .andWhere('bookmark.author_id = :author_id', { author_id: jwtPayload.id })
            .execute()

        if (deleteResponse.affected === 0) {
            const customError = new ErrorResponse(500, 'bookmark not removed')
            return next(customError)
        }

        res.customSuccess(200, 'bookmark removed successfully')
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to remove bookmark', err)
        return next(customError)
    }
}
