import * as admin from "firebase-admin"
import { Request, Response, NextFunction } from "express"
const serviceAccount = require("../infra/firebase.json")
serviceAccount.private_key_id = process.env.PRIVATE_KEY_ID

const BUCKET = 'incognitosocial-d1ef2.appspot.com'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET,
})

const bucket = admin.storage().bucket();

export const uploadImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) return next();

  const image = req.file
  const fileName = Date.now() + "." + image.originalname.split(".")[1]

  const file = bucket.file(fileName)

  const stream = file.createWriteStream({
    metadata: {
      contentType: image.mimetype,
    },
  })

  stream.on("error", (err: any) => {
    console.log(err)
    next(err)
  })

  stream.on("finish", async () => {
    await file.makePublic()

    const firebaseUrl = `https://storage.googleapis.com/${BUCKET}/${fileName}`

    req.body.firebaseUrl = firebaseUrl
  
    next();  
  })

  stream.end(image.buffer)
}

export const uploadProfileImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.files) return next()

  const images: Record<string, Express.Multer.File[]> = req.files as Record<string, Express.Multer.File[]>

  const uploadedUrls: Record<string, string> = {}

  const imageUpload = async (image: Express.Multer.File, fieldName: string) => {
    const fileName = Date.now() + '.' + image.originalname.split('.')[1]
    const file = bucket.file(fileName)

    const stream = file.createWriteStream({
      metadata: {
        contentType: image.mimetype
      }
    })

    stream.on("error", (err) => {
      console.log(err)
      next(err)
    })

    stream.on("finish", async () => {
      await file.makePublic()
      const firebaseUrl = `https://storage.googleapis.com/${BUCKET}/${fileName}`
      uploadedUrls[fieldName] = firebaseUrl

      if (Object.keys(uploadedUrls).length === 2) {
        req.body.uploadedUrls = uploadedUrls
        next()
      }
    })

    stream.end(image.buffer)
  }

  for (const [fieldName, imageArray] of Object.entries(images)) {
    if (fieldName === 'banner' || fieldName === 'icon') {
      const image = imageArray[0]
      imageUpload(image, fieldName)
    }
  }
}
