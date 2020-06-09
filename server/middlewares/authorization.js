const { Movie } = require('../models')

function authorization (req, res, next) {
    let { id } = req.params
    Movie.findByPk(id)
        .then(data => {
            if(!data) throw { status: 404, msg: 'Movie not found' }
            else if(data && data.userId == req.loggedUser.id) return next()
            else throw { status: 403, msg: 'youre not authorize' }
        })
        .catch(next)
}

module.exports = authorization