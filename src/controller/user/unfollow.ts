import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { User } from '../../entity/user/User'
import { UserFollow } from '../../entity/follow/UserFollow'

export const unfollow = async (req: Request, res: Response, next: NextFunction) => {
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

        if (!userFollow) {
            const customError = new ErrorResponse(404, 'user not followed')
            return next(customError)
        }

        const deleteResponse = await db
            .createQueryBuilder()
            .delete()
            .from(UserFollow)
            .where('follower_id = :follower_id', { follower_id: jwtPayload.id })
            .andWhere('following_id = :following_id', { following_id: id })
            .execute()

        if (deleteResponse.affected === 0) {
            const customError = new ErrorResponse(500, 'user not unfollowed')
            return next(customError)
        }

        res.customSuccess(200, 'user unfollowed successfully')
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to follow user', err)
        return next(customError)
    }
}
