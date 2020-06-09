require('dotenv').config()
const express = require('express')
const errorHandler = require('./middlewares/errorHandler')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const router = require('./routes')
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(router)
app.use(errorHandler)

app.listen(PORT, _=> console.log(`server is listen on PORT ${PORT}` ))