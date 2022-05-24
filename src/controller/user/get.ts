import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { User } from '../../entity/user/User'

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const userRepository = db.getRepository(User)

    try {
        const user = await userRepository
            .createQueryBuilder('user')
            .where('user.username = :username', { username: id })
            .getOne()

        if (!user) {
            const customError = new ErrorResponse(404, 'user not found')
            return next(customError)
        }

        res.customSuccess(200, '', { user })
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to get user', err)
        return next(customError)
    }
}
