const Image = require('../models/image')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const addImage = (req, res, next) => {
  try {
    const token = req.headers.token
    let decoded = jwt.verify(token, process.env.JWT_KEY)
    Image.create({
      user: decoded.id,
      url: req.file.cloudStoragePublicUrl
    }, (err, result) => {
      if (err) {
        res.status(500)
        res.json({ error: 'error save image url to database' })
      } else {
        res.status(200)
        res.json({ message: "photo successfully saved to database", data: result })
      }
    })
  } catch (err) {
    res.status(400)
      .json({ message: "token invalid" })
  }
}

const getImage = (req, res, next) => {
  try {
    const token = req.headers.token
    let decoded = jwt.verify(token, process.env.JWT_KEY)
    let query = {
      user: decoded.id
    }
    Image.find(query)
      .populate('user')
      .exec()
      .then(img => {
        res.status(200)
        res.json({ message: "successfully get photos", data: img })
      })
      .catch(err => {
        res.status(500)
        res.json({ error: 'error getting photos' })
      })
  } catch (err) {
    res.status(400)
      .json({ message: "token invalid" })
  }
}

module.exports = {
  addImage,
  getImage
}