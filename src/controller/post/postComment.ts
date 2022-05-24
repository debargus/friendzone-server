import { Request, Response, NextFunction } from 'express'

import { User } from '../../entity/user/User'
import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { Post } from '../../entity/post/Post'
import { Comment } from '../../entity/comment/Comment'

export const postComment = async (req: Request, res: Response, next: NextFunction) => {
    const { post_id, comment_text } = req.body
    const { jwtPayload } = req

    const userRepository = db.getRepository(User)
    const postRepository = db.getRepository(Post)
    const commentRepository = db.getRepository(Comment)

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
            const customError = new ErrorResponse(401, 'post not found')
            return next(customError)
        }

        const newComment = new Comment()
        newComment.comment_text = comment_text
        newComment.author = user
        newComment.post = post

        try {
            const comment = await commentRepository.save(newComment)
            res.customSuccess(200, 'comment created', { comment })
        } catch (err) {
            const customError = new ErrorResponse(500, 'comment not created', err)
            return next(customError)
        }
    } catch (err) {
        const customError = new ErrorResponse(500, 'comment not created', err)
        return next(customError)
    }
}
