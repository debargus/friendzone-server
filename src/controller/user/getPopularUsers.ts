import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { db } from '../../db'
import { User } from '../../entity/user/User'

export const getPopularUsers = async (_: Request, res: Response, next: NextFunction) => {
    const userRepository = db.getRepository(User)

    try {
        const users = await userRepository
            .createQueryBuilder('user')
            .leftJoin('user.followers', 'followers')
            .addOrderBy('followers', 'ASC')
            // .skip(0)
            // .take(10)
            .getMany()

        res.customSuccess(200, '', { users })
    } catch (err) {
        const customError = new ErrorResponse(500, 'failed to get popular users', err)
        return next(customError)
    }
}
