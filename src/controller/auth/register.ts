import { Request, Response, NextFunction } from 'express'

import { User } from '../../entity/user/User'
import { UserRegisterArgs } from '../../entity/user/types'
import { ErrorResponse } from '../../utils/response/errorResponse'
import { createJwtToken } from '../../utils/createJwtToken'
import { JwtPayload } from '../../types/JwtPayload'
import { db } from '../../db'

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, username, password }: UserRegisterArgs = req.body

    const userRepository = db.getRepository(User)

    try {
        const user = await userRepository
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .orWhere('user.username = :username', { username })
            .getOne()

        if (user) {
            const customError = new ErrorResponse(400, 'user already exists')
            return next(customError)
        }

        const isUsernameExists = await userRepository
            .createQueryBuilder('user')
            .where('user.username = :username', { username })
            .getOne()

        if (isUsernameExists) {
            const customError = new ErrorResponse(400, 'username already exists')
            return next(customError)
        }

        const newUser = new User()
        newUser.email = email
        newUser.name = name
        newUser.username = username
        newUser.saveHashedPassword(password)

        try {
            const user = await userRepository.save(newUser)

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
            res.customSuccess(200, 'registration successful')
        } catch (err) {
            const customError = new ErrorResponse(500, `user '${email}' can't be created`, err)
            return next(customError)
        }
    } catch (err) {
        const customError = new ErrorResponse(500, 'Registration failed', err)
        return next(customError)
    }
}
