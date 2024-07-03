const {body} = require('express-validator')

    const addClassValidation = [
        body('className')
            .trim()
            .isString()
            .withMessage('Class name must be a valid String')
            .bail()
            .isLength({min : 3, max : 100})
            .withMessage('min 3 character and max 100 character')        
    ]

    const addCourseValidation = [
        body('courseName')
            .trim()
            .isString()
            .withMessage('Course name must be a valid String')
            .bail()
            .isLength({min : 3, max : 100})
            .withMessage('min 3 character and max 100 character')
            ,
        body('classId')
            .trim()
            .isInt({min : 1})
            .withMessage('class_id must be Positive Integer')
            .bail()

    ]

module.exports = {addClassValidation, addCourseValidation }