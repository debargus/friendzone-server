import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Bookmark } from '../../entity/bookmark/Bookmark'

export const getMyBookmarks = async (req: Request, res: Response, next: NextFunction) => {
    const { jwtPayload } = req

    const bookmarkRepository = db.getRepository(Bookmark)

    try {
        const bookmarks = await bookmarkRepository
            .createQueryBuilder('bookmarks')
            .leftJoinAndSelect('bookmarks.post', 'post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.group', 'group')
            .leftJoinAndMapOne('post.my_upvote', 'post.upvotes', 'upvote', 'upvote.author_id = :author_id', {
                author_id: jwtPayload?.id
            })
            .leftJoinAndMapOne('post.my_downvote', 'post.downvotes', 'downvote', 'downvote.author_id = :author_id', {
                author_id: jwtPayload?.id
            })
            .leftJoinAndMapOne('post.my_hot', 'post.hots', 'hot', 'hot.author_id = :author_id', {
                author_id: jwtPayload?.id
            })
            .leftJoinAndMapOne('post.my_bookmark', 'post.bookmarks', 'bookmark', 'bookmark.author_id = :author_id', {
                author_id: jwtPayload?.id
            })
            .where('bookmark.author_id = :author_id', { author_id: jwtPayload.id })
            .getMany()

        res.customSuccess(200, '', { bookmarks })
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to get bookmarks', err)
        return next(customError)
    }
}
