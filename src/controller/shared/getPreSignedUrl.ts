import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../../utils/response/errorResponse'
import { getPresignedUrl } from '../../utils/s3'

export const getPreSignedUrl = async (_: Request, res: Response, next: NextFunction) => {
    try {
        const presignedUrl = getPresignedUrl('MEDIUM')
        res.customSuccess(200, 'success', { url: presignedUrl })
    } catch (err) {
        const customError = new ErrorResponse(400, 'error', err)
        return next(customError)
    }
}
