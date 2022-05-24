import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Post } from '../../entity/post/Post'

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const postRepository = db.getRepository(Post)

    try {
        const post = await postRepository
            .createQueryBuilder('post')
            .where('post.id = :id', { id })
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.group', 'group')
            .leftJoinAndSelect('post.comments', 'comments')
            .loadRelationCountAndMap('post.comments_count', 'post.comments', 'comments_count')
            .leftJoinAndSelect('comments.author', 'comment_author')
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
