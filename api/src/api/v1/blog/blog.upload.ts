import { Request, Response } from 'express'
import multer               from 'multer'
import { uploadFile }       from '../../../lib/storage'
import { sendSuccess }      from '../../../utils/response'
import { AppError }         from '../../../utils/AppError'
import { logger }           from '../../../lib/logger'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
const MAX_SIZE_MB   = 5

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error(`File type not allowed. Use: jpeg, png, gif, webp, svg`))
    }
  },
}).single('image')

/** POST /api/v1/blog/upload-image
 *  Accepts: multipart/form-data with field 'image'
 *  Returns: { url, markdown }
 */
export async function uploadBlogImage(req: Request, res: Response): Promise<void> {
  if (!req.file) throw AppError.badRequest('No image file provided')

  const { key, url } = await uploadFile(req.file, 'blog-images')
  logger.info('Blog image uploaded', { key, size: req.file.size })

  sendSuccess(res, {
    url,
    markdown: `![${req.file.originalname.replace(/\.[^.]+$/, '')}](${url})`,
  })
}
