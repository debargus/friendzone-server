import { Request, Response, NextFunction } from 'express'

import { User } from '../../entity/user/User'
import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Post } from '../../entity/post/Post'
import { Hot } from '../../entity/hot/Hot'

export const addHot = async (req: Request, res: Response, next: NextFunction) => {
    const { id: post_id } = req.params
    const { jwtPayload } = req

    const userRepository = db.getRepository(User)
    const postRepository = db.getRepository(Post)
    const hotRepository = db.getRepository(Hot)

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

        const hot = await hotRepository
            .createQueryBuilder('hot')
            .where('hot.post_id = :post_id', { post_id: post.id })
            .andWhere('hot.author_id = :author_id', { author_id: user.id })
            .getOne()

        if (hot) {
            const customError = new ErrorResponse(400, 'hot already added')
            return next(customError)
        }

        const newHot = new Hot()
        newHot.post = post
        newHot.author = user
        post.hots_count += 1

        try {
            const hot = await hotRepository.save(newHot)
            await postRepository.save(post)
            res.customSuccess(200, 'hot added', { hot })
        } catch (err) {
            const customError = new ErrorResponse(500, 'hot add failed', err)
            return next(customError)
        }
    } catch (err) {
        const customError = new ErrorResponse(500, 'hot add failed', err)
        return next(customError)
    }
}
