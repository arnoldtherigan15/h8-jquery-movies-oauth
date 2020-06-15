const router = require('express').Router()
const userRouter = require('./userRouter')
const movieRouter = require('./movieRouter')

router.get('/', (req,res) => res.json({msg: 'welcome to netflix'}))

router.use('/users', userRouter)
router.use('/movies', movieRouter)

module.exports = router