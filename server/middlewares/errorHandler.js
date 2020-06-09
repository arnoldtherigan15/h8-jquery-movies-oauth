module.exports = (err, req, res, next) => {
    console.log(err,'errrorrrr')
    console.log(err.msg, err.name,'name');
    console.log(err.status,'--------------');
    
    
    const status = 500 || err.status
    const errors = []
    switch (err.name) {
        case "SequelizeUniqueConstraintError":
            errors.push('email is being used')
            return res.status(400).json({ errors })
        case "invalidEmailPassword":
            errors.push(err.msg)
            return res.status(err.status).json({ errors })
        default:
            errors.push(err.msg || 'internal server error')
            res.status(status).json({
                errors
            })
        break;
    }
    
}