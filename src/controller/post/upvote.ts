import { Request, Response, NextFunction } from 'express'

import { User } from '../../entity/user/User'
import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Post } from '../../entity/post/Post'
import { Upvote } from '../../entity/upvote/Upvote'
import { Downvote } from '../../entity/downvote/Downvote'

export const upvote = async (req: Request, res: Response, next: NextFunction) => {
    const { id: post_id } = req.params
    const { jwtPayload } = req

    const userRepository = db.getRepository(User)
    const postRepository = db.getRepository(Post)
    const upvoteRepository = db.getRepository(Upvote)
    const downvoteRepository = db.getRepository(Downvote)

    console.log('hellop')

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

        const upvote = await upvoteRepository
            .createQueryBuilder('upvote')
            .where('upvote.post_id = :post_id', { post_id: post.id })
            .andWhere('upvote.author_id = :author_id', { author_id: user.id })
            .getOne()

        if (upvote) {
            const customError = new ErrorResponse(400, 'upvote already exists')
            return next(customError)
        }

        const downvote = await downvoteRepository
            .createQueryBuilder('downvote')
            .where('downvote.post_id = :post_id', { post_id: post.id })
            .andWhere('downvote.author_id = :author_id', { author_id: user.id })
            .getOne()

        if (downvote) {
            await downvoteRepository.delete({ id: downvote.id })
            post.downvotes_count -= 1
        }

        const newUpvote = new Upvote()
        newUpvote.post = post
        newUpvote.author = user

        post.upvotes_count += 1

        try {
            const upvote = await upvoteRepository.save(newUpvote)
            await postRepository.save(post)
            res.customSuccess(200, 'post upvoted', { upvote })
        } catch (err) {
            const customError = new ErrorResponse(500, 'upvote failed', err)
            return next(customError)
        }
    } catch (err) {
        const customError = new ErrorResponse(500, 'upvote failed', err)
        return next(customError)
    }
}
