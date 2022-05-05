declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: string
        NODE_ENV: string
        TYPEORM_DB_HOST: string
        TYPEORM_DB_PORT: string
        TYPEORM_DB_USERNAME: string
        TYPEORM_DB_PASSWORD: string
        TYPEORM_DB_NAME: string
        TYPEORM_DB_LOGGING: string
        TYPEORM_DB_SYNCHRONIZE: string
        JWT_TOKEN_SECRET: string
        JWT_TOKEN_SECRET_EXPIRATION: string
    }
}
