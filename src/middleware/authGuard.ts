import { verify } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { ErrorResponse } from '../utils/response/errorResponse'

export const authGuard = (req: Request, _: Response, next: NextFunction) => {
    const jwtToken = req.cookies?.jwt

    if (!jwtToken) {
        const customError = new ErrorResponse(401, 'not authenticated')
        return next(customError)
    }

    try {
        const payload = verify(jwtToken, process.env.JWT_TOKEN_SECRET)
        req.jwtPayload = payload as any
    } catch (err) {
        const customError = new ErrorResponse(401, 'bad jwt')
        return next(customError)
    }

    return next()
}
