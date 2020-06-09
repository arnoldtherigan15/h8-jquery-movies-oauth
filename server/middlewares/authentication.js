const { verifyToken } = require('../helpers/jwt')
const { User } = require('../models')

function authentication(req, res, next) {
    
    let token = req.headers.token
    if(token) {
        try {
            let decodedToken = verifyToken(token)
            User.findByPk(decodedToken.id)
                .then(data => {
                    if(data) {
                        req.loggedUser = decodedToken
                        return next()
                    } else {
                        throw { msg: 'authentication failed', status: 401 }
                    }
                })
        } catch (err) {
            throw { msg: 'invalid token', status: 401 }
        }
    } else {
        throw { msg: 'Token Not Found', status: 404 }
    }
}

module.exports = authentication