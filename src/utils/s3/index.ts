import S3 from 'aws-sdk/clients/s3'
import { nanoid } from 'nanoid'

const bucketName = process.env.AWS_S3_BUCKET_NAME
const region = process.env.AWS_S3_BUCKET_REGION
const accessKeyId = process.env.AWS_S3_BUCKET_ACCESS_KEY
const secretAccessKey = process.env.AWS_S3_BUCKET_SECRET_KEY

const s3Client = new S3({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
    // maxRetries: 3
})

type UPLOAD_FILE_SIZE = 'LARGE' | 'MEDIUM' | 'SMALL'

// get presigned url for a file
export function getPresignedUrl(fileSize: UPLOAD_FILE_SIZE) {
    const fileKey = nanoid(16)
    const expiry = fileSize === 'LARGE' ? 60 * 5 : fileSize === 'MEDIUM' ? 60 * 2 : fileSize === 'SMALL' ? 30 : 30

    const params = { Bucket: bucketName, Key: fileKey, Expires: expiry }
    const presignedUrl: string = s3Client.getSignedUrl('putObject', params)

    if (!presignedUrl) {
        return { error: 'Unable to get presigned upload URL from S3' }
    }

    return presignedUrl
}

// get a file from s3
export async function getFileFromS3(key: string) {
    const getParams: S3.GetObjectRequest = {
        Key: key,
        Bucket: bucketName
    }

    try {
        await s3Client
            .headObject(getParams) // checking if object present in the s3 bucket
            .promise()
        return s3Client.getObject(getParams).createReadStream()
    } catch (error) {
        throw error
    }
}

// delete a file from s3
export async function deleteFileFromS3(key: string) {
    const deleteParams: S3.GetObjectRequest = {
        Key: key,
        Bucket: bucketName
    }

    try {
        await s3Client
            .headObject(deleteParams) // checking if object present in the s3 bucket
            .promise()
        return s3Client.deleteObject(deleteParams)
    } catch (error) {
        throw error
    }
}
