import { Request, Response, NextFunction } from 'express'

import { User } from '../../entity/user/User'
import { UserLoginArgs } from '../../entity/user/types'
import { ErrorResponse } from '../../utils/response/errorResponse'
import { createJwtToken } from '../../utils/createJwtToken'
import { JwtPayload } from '../../types/JwtPayload'
import { db } from '../../db'

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password }: UserLoginArgs = req.body

    const userRepository = db.getRepository(User)

    try {
        const user = await userRepository
            .createQueryBuilder('user')
            .where('user.username = :username', { username })
            .addSelect('user.password')
            .getOne()

        if (!user) {
            const customError = new ErrorResponse(404, 'user not found')
            return next(customError)
        }

        if (!user.checkIfPasswordMatch(password)) {
            const customError = new ErrorResponse(400, 'incorrect password')
            return next(customError)
        }

        try {
            const jwtPayload: JwtPayload = {
                id: user.id,
                username: user.username
            }

            const token = await createJwtToken(
                jwtPayload,
                process.env.JWT_TOKEN_SECRET,
                process.env.JWT_TOKEN_SECRET_EXPIRATION
            )

            res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 * 24 })
            res.customSuccess(200, 'login successful')
        } catch (err) {
            const customError = new ErrorResponse(500, `token can't be created`, err)
            return next(customError)
        }
    } catch (err) {
        const customError = new ErrorResponse(500, 'login failed', err)
        return next(customError)
    }
}
