import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Post } from '../../entity/post/Post'

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { jwtPayload } = req

    const postRepository = db.getRepository(Post)

    try {
        const post = await postRepository
            .createQueryBuilder('post')
            .where('post.id = :id', { id })
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.group', 'group')
            .leftJoinAndSelect('post.comments', 'comments')
            .leftJoinAndSelect('comments.author', 'comment_author')
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
            .getOne()

        if (!post) {
            const customError = new ErrorResponse(404, 'post not found')
            return next(customError)
        }

        res.customSuccess(200, '', { post })
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to get post', err)
        return next(customError)
    }
}
