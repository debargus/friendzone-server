import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Post } from '../../entity/post/Post'

export const getPopularPublicPosts = async (_: Request, res: Response, next: NextFunction) => {
    const postRepository = db.getRepository(Post)

    try {
        const posts = await postRepository
            .createQueryBuilder('post')
            .orderBy('post.created_at', 'DESC')
            .andWhere('post.is_public = :is_public', { is_public: true })
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.group', 'group')
            .getMany()

        res.customSuccess(200, '', { posts })
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to get post', err)
        return next(customError)
    }
}
