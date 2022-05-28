import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { User } from '../../entity/user/User'
import { UserFollow } from '../../entity/follow/UserFollow'

export const follow = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { jwtPayload } = req

    const userRepository = db.getRepository(User)
    const followRepository = db.getRepository(UserFollow)

    try {
        const followingUser = await userRepository
            .createQueryBuilder('follow_user')
            .where('follow_user.id = :id', { id })
            .getOne()

        if (!followingUser) {
            const customError = new ErrorResponse(404, 'following user not found')
            return next(customError)
        }

        const follower = await userRepository
            .createQueryBuilder('follower')
            .where('follower.id = :id', { id: jwtPayload.id })
            .getOne()

        if (!follower) {
            const customError = new ErrorResponse(404, 'user not found')
            return next(customError)
        }

        const userFollow = await followRepository
            .createQueryBuilder('userfollow')
            .where('userfollow.follower_id = :follower_id', { follower_id: jwtPayload.id })
            .andWhere('userfollow.following_id = :following_id', { following_id: id })
            .getOne()

        if (userFollow) {
            const customError = new ErrorResponse(400, 'user already followed')
            return next(customError)
        }

        const newUserFollow = new UserFollow()
        newUserFollow.follower = follower
        newUserFollow.following = followingUser

        try {
            await followRepository.save(newUserFollow)
            res.customSuccess(200, 'user followed successfully')
        } catch (err) {
            const customError = new ErrorResponse(500, 'failed to follow user', err)
            return next(customError)
        }
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to follow user', err)
        return next(customError)
    }
}
