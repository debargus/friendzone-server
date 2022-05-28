import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { UpdatePostArgs } from '../../entity/post/types'
import { Post } from '../../entity/post/Post'

export const update = async (req: Request, res: Response, next: NextFunction) => {
    const { content, is_public }: UpdatePostArgs = req.body
    const { id: post_id } = req.params
    const { jwtPayload } = req

    const postRepository = db.getRepository(Post)

    try {
        const post = await postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .where('post.id = :post_id', { post_id })
            .andWhere('author.id = :author_id', { author_id: jwtPayload.id })
            .getOne()

        if (!post) {
            const customError = new ErrorResponse(404, 'post not found')
            return next(customError)
        }

        const updateObj = {
            ...(content && { content }),
            ...(is_public !== undefined && { is_public }),
            is_updated: true
        }

        console.log('updateObj', updateObj)

        await db.createQueryBuilder().update(Post).set(updateObj).where('id = :post_id', { post_id }).execute()

        res.customSuccess(200, 'post updated successfully')
    } catch (err) {
        const customError = new ErrorResponse(500, 'post update failed', err)
        return next(customError)
    }
}
