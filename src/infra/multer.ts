import multer from 'multer'
import path from 'path'
import crypto from 'node:crypto'

const upload = multer({
  dest: path.resolve(__dirname, '..', 'tmp', 'uploads'),
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, path.resolve(__dirname, '..', 'tmp', 'uploads'))
    },
    filename(req, file, callback) {
      const fileName = `${crypto.randomBytes(20).toString('hex')}-${file.originalname}`
      callback(null, fileName)
    }
  })
})

export { upload }