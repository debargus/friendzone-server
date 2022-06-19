import { Request, Response, NextFunction } from 'express'

import { User } from '../../entity/user/User'
import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Post } from '../../entity/post/Post'
import { Hot } from '../../entity/hot/Hot'

export const removeHot = async (req: Request, res: Response, next: NextFunction) => {
    const { id: post_id } = req.params
    const { jwtPayload } = req

    const userRepository = db.getRepository(User)
    const postRepository = db.getRepository(Post)

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

        const deleteResponse = await db
            .createQueryBuilder()
            .delete()
            .from(Hot)
            .where('hot.post_id = :post_id', { post_id })
            .andWhere('hot.author_id = :author_id', { author_id: jwtPayload.id })
            .execute()

        if (deleteResponse.affected === 0) {
            const customError = new ErrorResponse(500, 'hot not removed')
            return next(customError)
        }

        post.hots_count -= 1
        await postRepository.save(post)

        res.customSuccess(200, 'hot removed successfully')
    } catch (err) {
        const customError = new ErrorResponse(500, 'hot remove failed', err)
        return next(customError)
    }
}
