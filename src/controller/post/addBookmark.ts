import { Request, Response, NextFunction } from 'express'

import { User } from '../../entity/user/User'
import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Post } from '../../entity/post/Post'
import { Bookmark } from '../../entity/bookmark/Bookmark'

export const addBookmark = async (req: Request, res: Response, next: NextFunction) => {
    const { id: post_id } = req.params
    const { jwtPayload } = req

    const userRepository = db.getRepository(User)
    const postRepository = db.getRepository(Post)
    const bookmarkRepository = db.getRepository(Bookmark)

    try {
        const user = await userRepository
            .createQueryBuilder('user')
            .where('user.username = :username', { username: jwtPayload.username })
            .getOne()

        if (!user) {
            const customError = new ErrorResponse(404, 'user not found')
            return next(customError)
        }

        const post = await postRepository.createQueryBuilder('post').where('post.id = :id', { id: post_id }).getOne()

        if (!post) {
            const customError = new ErrorResponse(404, 'post not found')
            return next(customError)
        }

        const bookmark = await bookmarkRepository
            .createQueryBuilder('bookmark')
            .where('bookmark.post_id = :post_id', { post_id: post.id })
            .andWhere('bookmark.author_id = :author_id', { author_id: user.id })
            .getOne()

        if (bookmark) {
            const customError = new ErrorResponse(400, 'bookmark already added')
            return next(customError)
        }

        const newBookmark = new Bookmark()
        newBookmark.post = post
        newBookmark.author = user

        try {
            const bookmark = await bookmarkRepository.save(newBookmark)
            res.customSuccess(200, 'bookmark added', { bookmark })
        } catch (err) {
            const customError = new ErrorResponse(500, 'bookmark add failed', err)
            return next(customError)
        }
    } catch (err) {
        const customError = new ErrorResponse(500, 'bookmark add failed', err)
        return next(customError)
    }
}
