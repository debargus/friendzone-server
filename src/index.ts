import 'dotenv/config'
import 'reflect-metadata'
import fs from 'fs'
import path from 'path'

import cors, { CorsOptions } from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import './utils/response/successResponse'
import { errorHandler } from './middleware/errorHandler'
import routes from './routes'
import { dbConnection } from './db'

export const app = express()
const port = process.env.PORT || 4000
const accessLogStream = fs.createWriteStream(path.join(__dirname, '../log/access.log'), { flags: 'a' })

const corsOptions: CorsOptions = {
    credentials: true,
    origin: 'http://localhost:3000'
}

async function main() {
    await dbConnection
    app.use(cors(corsOptions))
    app.use(helmet())
    app.use(cookieParser())
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(morgan('combined', { stream: accessLogStream }))

    app.use('/', routes) // routes

    app.use(errorHandler)

    app.listen(port, () => {
        console.log(`Server started and running on port ${port} 🚀`)
    })
}

main()
