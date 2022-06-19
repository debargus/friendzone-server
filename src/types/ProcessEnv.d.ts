declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: string
        NODE_ENV: string
        TYPEORM_DB_HOST: string
        TYPEORM_DB_PORT: string
        TYPEORM_DB_USERNAME: string
        TYPEORM_DB_PASSWORD: string
        TYPEORM_DB_NAME: string
        JWT_TOKEN_SECRET: string
        JWT_TOKEN_SECRET_EXPIRATION: string
        AWS_S3_BUCKET_NAME: string
        AWS_S3_BUCKET_REGION: string
        AWS_S3_BUCKET_ACCESS_KEY: string
        AWS_S3_BUCKET_SECRET_KEY: string
        CLOUDFRONT_DOMAIN: string
    }
}
