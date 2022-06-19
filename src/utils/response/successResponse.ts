
import { response, Response } from 'express'

response.customSuccess = function (status: number, message: string, data: any = null): Response {
    return this.status(status).json({ status, message, data })
}