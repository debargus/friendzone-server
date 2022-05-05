import jwt from 'jsonwebtoken'

export const createJwtToken = async (payload: any, secret: string, expiresIn: string = '1h'): Promise<string> => {
    return jwt.sign(payload, secret, { expiresIn })
}
