const {body} = require('express-validator')


    const addQuestionValidation = [
        body('question')
          .trim()
          .isString()
          .withMessage('Question must be a valid String')
          .bail()
          .isLength({min : 1, max : 255})
          .withMessage('min 1 character and max 255 character')
          ,

        body('option1')
          .trim()
          .isString()
          .withMessage('Option 1 must be a valid String')
          .bail()
          .isLength({min : 1, max : 255})
          .withMessage('min 1 character and max 255 character')
          ,

        body('option2')
          .trim()
          .isString()
          .withMessage('Option 2 must be a valid String')
          .bail()
          .isLength({min : 1, max : 255})
          .withMessage('min 1 character and max 255 character')
          ,

        body('option3')
          .trim()
          .isString()
          .withMessage('Option 3 must be a valid String')
          .bail()
          .isLength({min : 1, max : 255})
          .withMessage('min 1 character and max 255 character')
          ,
        body('option4')
          .trim()
          .isString()
          .withMessage('Option 4 must be a valid String')
          .bail()
          .isLength({min : 1, max : 255})
          .withMessage('min 1 character and max 255 character')
          ,
        body('ans')
          .trim()
          .isInt({ min: 1, max: 4 })
          .withMessage('Ans must be a valid Number between 1 and 4')
          .bail()
          ,
        body('classId')
          .optional()
          .trim()
          .isInt({ min: 1 })
          .withMessage('classId must be a valid Number Greater than 0 ')
          .bail()
          ,
        body('courseId')
          .optional()
          .trim()
          .isInt({ min: 1 })
          .withMessage('courseId must be a valid Number Greater than 0 ')
          .bail()
          ,
        
        body('addedBy')
          .trim()
          .isInt({ min: 1 })
          .withMessage('addedBy must be a valid Number Greater than 0 ')
          .bail()
          ,
        
    ]

    

    // const addRoleValidation = [
    //     body('roleName')
    //         .trim()
    //         .isString()
    //         .withMessage('Vahicle name must be a valid String')
    //         .bail()
    //         .isLength({min : 3, max : 30})
    //         .withMessage('min 3 character and max 30 character')
    //         ,
    //     body('status')
    //         .optional()
    //         .trim()
    //         .isString()
    //         .withMessage('Vahicle name must be a valid String')
    //         .bail()
    //         .custom(async value => {
    //             if (value != "active" && value != "inactive") {
    //                 throw new Error('status must be in active or inactive');
    //             }
    //           })
    // ]

    // const addRootValidation = [
    //     body('status')
    //         .optional()
    //         .trim()
    //         .isString()
    //         .withMessage('Vahicle name must be a valid String')
    //         .bail()
    //         .custom(async value => {
    //             if (value != "active" && value != "inactive") {
    //                 throw new Error('status must be in active or inactive');
    //             }
    //           })
    // ]

module.exports = { addQuestionValidation }