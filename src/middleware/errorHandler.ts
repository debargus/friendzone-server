import { Request, Response, NextFunction } from 'express'

import { ErrorResponse } from '../utils/response/errorResponse'

export const errorHandler = (err: ErrorResponse, _: Request, res: Response, __: NextFunction) => {
    const status = err.status || 500
    const message = err.message || 'Something went wrong'
    res.status(status).json({
        status,
        message,
        error: err.error
    })
}