const {body} = require('express-validator')

    const addContestValidation = [
        body('name')
            .trim()
            .isString()
            .withMessage('Contest name must be a valid String')
            .bail()
            .isLength({min : 3, max : 100})
            .withMessage('min 3 character and max 100 character')
            ,
        body('time')
            .trim()
            .isString()
            .isDate()
            .withMessage('time must be a valid Date String')
            .bail()
            .isLength({min : 16, max : 16})
            .withMessage('time string Example : 2024-06-26T20:00')
            ,
        body('duration_munite')
            .trim()
            .isInt({min : 1})
            .withMessage('Contest Duration in Munite, Ex: 60')
            .bail()
            ,
        body('total_marks')
            .trim()
            .isInt({min : 1})
            .withMessage('Total Marks in Positive Integer')
            .bail()
            ,
        body('pass_marks')
            .trim()
            .isInt({min : 1})
            .withMessage('Minimum Pass Marks in Positive Integer')
            .bail()
            ,
        body('negative_marks')
            .trim()
            .isFloat({min : 0})
            .withMessage('Negative Marks in Positive Floating value')
            .bail()
            ,
        body('questions_ids')
            .trim()
            .isString()
            .withMessage('questions_ids must be a valid String of array')
            .bail()
            .isLength({min : 3})
            .withMessage('min 3 character a')
            ,
        body('class_id')
            .trim()
            .isFloat({min : 0})
            .withMessage('class_id refers to Positive Integer Number')
            .bail()
            ,
        body('course_id')
            .trim()
            .isFloat({min : 0})
            .withMessage('course_id refers to Positive Integer Number')
            .bail()
            
    ]

module.exports = {addContestValidation }