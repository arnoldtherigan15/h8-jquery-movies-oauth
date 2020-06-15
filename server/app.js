const express = require('express')
const app = express()

if(process.env.NODE_ENV == 'development') {
    require('dotenv').config()
    const morgan = require('morgan')
    app.use(morgan('dev'))
}

const errorHandler = require('./middlewares/errorHandler')
const cors = require('cors')
const router = require('./routes')
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(router)
app.use(errorHandler)

app.listen(PORT, _=> console.log(`server is listen on PORT ${PORT}` ))