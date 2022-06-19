import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { User } from '../../entity/user/User'
import { ProfileUpdateArgs } from '../../entity/user/types'

export const update = async (req: Request, res: Response, next: NextFunction) => {
    const { username, name, avatar, cover_image, description, dob }: ProfileUpdateArgs = req.body
    const { jwtPayload } = req

    try {
        const updateObj = {
            ...(username && { username }),
            ...(name && { name }),
            ...(avatar && { avatar }),
            ...(cover_image && { cover_image }),
            ...(description && { description }),
            ...(dob && { dob })
        }

        await db
            .createQueryBuilder()
            .update(User)
            .set(updateObj)
            .where('username = :username', { username: jwtPayload.username })
            .execute()

        res.customSuccess(200, 'profile updated successfully')
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to update user', err)
        return next(customError)
    }
}
