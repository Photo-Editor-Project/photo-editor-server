const router = require('express').Router()
const img = require('../middlewares/img')
const { addImage, getImage, addImageFromURL } = require('../controllers/image')
const { userAuth } = require('../middlewares/auth')

router.post('/', userAuth, img.multer.single('image'), img.sendUploadToGCS, addImage)
router.get('/', userAuth, getImage)
router.post('/url', userAuth, addImageFromURL)

module.exports = router