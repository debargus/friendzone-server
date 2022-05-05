import { Request, Response, NextFunction } from 'express'

import { User } from '../../entity/user/User'
import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    const { jwtPayload } = req

    const userRepository = db.getRepository(User)

    try {
        const user = await userRepository
            .createQueryBuilder('user')
            .where('user.username = :username', { username: jwtPayload.username })
            .getOne()

        if (!user) {
            const customError = new ErrorResponse(404, 'user not found')
            return next(customError)
        }

        try {
            res.cookie('jwt', '')
            res.customSuccess(200, 'logged out successfully')
        } catch (err) {
            const customError = new ErrorResponse(500, 'logout failed', err)
            return next(customError)
        }
    } catch (err) {
        const customError = new ErrorResponse(500, 'logout failed', err)
        return next(customError)
    }
}
