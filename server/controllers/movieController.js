const { Movie } = require('../models')

class MovieController {
    static findAll(req, res, next) {
        Movie.findAll({
           where: {
               userId: req.loggedUser.id
           }
       })
        .then(data => {
            res.status(200).json({
                movies: data
            })
        })
        .catch(next)
    }
    static findOne(req, res, next) {
      Movie.findByPk(req.params.id)
        .then(data => {
            res.status(200).json({
                movie: data
            })
        })
        .catch(next)
    }

    static create(req, res, next) {
        let { title, genre, imageUrl } = req.body
        Movie.create({
            title,
            genre,
            imageUrl,
            userId: req.loggedUser.id
        })
            .then(data => {
                res.status(201).json({
                    movie: data
                })
            })
            .catch(next)
    }

    static update(req, res, next) {
        let { id } = req.params
        Movie.findByPk(id)
        .then(data => {
          if (!data) {
            throw { status: 404, msg: 'Movie not found' }
          }
    
          data.update({
            ...data, //spread out existing recipe
            ...req.body //spread out req.body - the differences in the body will override the recipe returned from DB.
          })
          .then((updatedMovie) => {
            return res.status(200).json(updatedMovie)
          })
          .catch(next)
        })
        .catch(next)
    }

    static destroy(req, res, next) {
        let { id } = req.params
        Movie.findByPk(id)
        .then(data => {
          if (!data) {
            throw { status: 404, msg: 'movie not found' }
          }
          data.destroy()
            .then(_ => {
              return res.status(200).json({ msg: 'movie deleted' })
            })
            .catch(next);
        })
        .catch(next)
    }
}

module.exports = MovieController