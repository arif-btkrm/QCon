const {body, validationResult} = require('express-validator')

const validate = (req, res, next) => {
    const errorFormat = ({msg, param}) => {
        return `[${param}]: ${msg}`;
    };

    const errors = validationResult(req).formatWith(errorFormat);
    if(!errors.isEmpty()){
        return res.status(400).json(errors.mapped())
    }
    next()
}

module.exports = validate;