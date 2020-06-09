const { User } = require('../models')
const { generateToken } = require('../helpers/jwt')
const { comparePassword } = require('../helpers/bcrypt')
const createError = require('http-errors')
const {OAuth2Client} = require('google-auth-library');


class UserController {
    static register (req, res, next) {
        let { email, password } = req.body
        User.create({
            email,
            password
        })
            .then(data => {
                let payload = {
                    email: data.email,
                    id: data.id
                }
                return res.status(201).json({
                    data: {
                        email: data.email,
                        id: data.id,
                        token: generateToken(payload)
                    }
                })
            })
            .catch(next)
    }

    static login (req, res, next) {
        let { email, password } = req.body

        User.findOne({
            where: {
                email
            }
        })
            .then(data => {
                if(data && comparePassword(password, data.password)) {
                    let payload = {
                        email: data.email,
                        id: data.id
                    }
                    return res.status(200).json({
                        data: {
                            email: data.email,
                            id: data.id,
                            token: generateToken(payload)
                        }
                    })
                } else {    
                    return next(createError(404, { name:'invalidEmailPassword', msg:'invalid email or password' }))
                }
            })
            .catch(next)
    }

    static googleSign(req, res, next) {
        const client = new OAuth2Client(process.env.CLIENT_ID);
        console.log('masuk', process.env.CLIENT_ID);
        let email = null
        client.verifyIdToken({
            idToken: req.body.id_token,
            audience: process.env.CLIENT_ID
        })
            .then(ticket => {
                console.log(ticket.getPayload(),'ticket');
                email = ticket.getPayload().email
                return User.findOne({
                    where: { email }
                })
            })
            .then(data => {
                if(data) {
                    let payload = {
                        email: data.email,
                        id: data.id
                    }
                    return res.status(200).json({
                        data: {
                            email: data.email,
                            id: data.id,
                            token: generateToken(payload)
                        }
                    })
                } else {
                    return User.create({email, password:"Google123"})
                }
            })
            .then(data => {
                let payload = {
                    email: data.email,
                    id: data.id
                }
                return res.status(200).json({
                    data: {
                        email: data.email,
                        id: data.id,
                        token: generateToken(payload)
                    }
                })
            })
            .catch(err => {
                console.log(err,'erorrrrrrrrrrrrrrrrrrrrrrrrrrr');
                next(err)
            })
    }
}

module.exports = UserController