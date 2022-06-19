export class ErrorResponse extends Error {
    status: number
    message: string
    error: any
    constructor(status: number, message: string, error?: any) {
        super(message)
        this.status = status
        this.message = message
        this.error = error ?? null
    }
}