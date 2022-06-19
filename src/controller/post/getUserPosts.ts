import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Post } from '../../entity/post/Post'

export const getUserPosts = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.params
    const { jwtPayload } = req

    const postRepository = db.getRepository(Post)

    try {
        const posts = await postRepository
            .createQueryBuilder('post')
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
            .where('author.id = :user_id', { user_id })
            .getMany()

        res.customSuccess(200, '', { posts })
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to get post', err)
        return next(customError)
    }
}
