const router = require('express').Router()
const movieController = require('../controllers/movieController')
const authentication = require('../middlewares/authentication')
const authorization = require('../middlewares/authorization')

router.use(authentication)
router.get('/', movieController.findAll)
router.post('/', movieController.create)

router.get('/:id', authorization,movieController.findOne)
router.put('/:id', authorization,movieController.update)
router.delete('/:id', authorization,movieController.destroy)

module.exports = router