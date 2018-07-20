'use strict'
require('dotenv').config()

// Imports the Google Cloud client library
const Storage = require('@google-cloud/storage');
const cloudBucket = process.env.CLOUD_BUCKET

// Your Google Cloud Platform project ID
// Creates a client
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT,
  keyFilename: process.env.KEYFILE_PATH
});

// The name for the new bucket
const bucketName = storage.bucket(cloudBucket);

const getPublicUrl = (filename) => {
  return `https://storage.googleapis.com/${cloudBucket}/${filename}`
}

const sendUploadToGCS = (req, res, next) => {
  if (!req.file) {
    return next('file gagal upload')
  }
  //naming file
  const gcsname = Date.now() + req.file.originalname
  const file = bucketName.file(gcsname)

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  })

  stream.on('error', (err) => {
    console.log(err)
    req.file.cloudStorageError = err
    next(err)
  })

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname
    file.makePublic().then(() => {
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
      next()
    })
  })

  stream.end(req.file.buffer)
}

const Multer = require('multer'),
  multer = Multer({
    storage: Multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      const type = file.mimetype.split('/').shift()
      if (type != 'image') cb({ status: 400, error: 'filetype is not acceptabel' }, false)
      else cb(null, true)
    },
    limits: {
      fileSize: 5 * 1024 * 1024
    }
    // dest: '../images'
  })

module.exports = {
  getPublicUrl,
  sendUploadToGCS,
  multer
}