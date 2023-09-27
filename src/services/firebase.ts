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
