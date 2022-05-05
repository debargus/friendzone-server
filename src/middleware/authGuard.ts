import { verify } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'

export const authGuard = (req: Request, _: Response, next: NextFunction) => {
    const jwtToken = req.cookies?.jwt

    if (!jwtToken) throw new Error('not authenticated')

    try {
        const payload = verify(jwtToken, process.env.JWT_TOKEN_SECRET)
        req.jwtPayload = payload as any
    } catch (err) {
        throw new Error('not authenticated')
    }

    return next()
}
