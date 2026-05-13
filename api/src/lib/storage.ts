import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '../config/env'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

export const storageClient = new S3Client({
  endpoint: env.STORAGE_ENDPOINT,
  region: env.STORAGE_REGION,
  credentials: {
    accessKeyId: env.STORAGE_ACCESS_KEY,
    secretAccessKey: env.STORAGE_SECRET_KEY,
  },
  // Required for MinIO path-style access
  forcePathStyle: true,
})

const BUCKET = env.STORAGE_BUCKET

export async function uploadFile(
  file: Express.Multer.File,
  folder: string
): Promise<{ key: string; url: string }> {
  const ext = path.extname(file.originalname)
  const key = `${folder}/${uuidv4()}${ext}`

  await storageClient.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
    })
  )

  const url = `${env.STORAGE_ENDPOINT}/${BUCKET}/${key}`
  return { key, url }
}

export async function deleteFile(key: string): Promise<void> {
  await storageClient.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}

export async function getPresignedUrl(key: string, expiresIn = 3_600): Promise<string> {
  return getSignedUrl(
    storageClient,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn }
  )
}
