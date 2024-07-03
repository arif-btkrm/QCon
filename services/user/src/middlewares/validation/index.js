const {body} = require('express-validator')
const {getUserByEmail} = require('./../../controllers/userController')




const signInValidation = [
        body('email')
        .trim()
        .normalizeEmail({ all_lowercase: true})
        .isEmail()
        .withMessage('provide a valid Email address')
        ,
        body('password')
        .trim()
        .isString().withMessage('password must me a valid String')
        .isLength({min : 4}).withMessage('minimum 4 character')
    ]
    
const signUpValidation  = [
    body('name')
    .trim()
    .isString()
    .withMessage('name must be a valid String')
    .bail()
    .isLength({min : 5, max: 30})
    .withMessage('min 5 character and max 30 character')
    ,
    
    body('email')
    .trim()
    .normalizeEmail({ all_lowercase: true})
    .isEmail()
    .withMessage('provide a valid Email address')
    .custom(async value => {
        const user = await getUserByEmail(value);
        if (user) {
          throw new Error('E-mail already in use');
        }
      })
    , 

    body('password')
    .trim()
    .isString().withMessage('password must me a valid String')
    .isLength({min : 4}).withMessage('minimum 4 character')
    ]

    const addTeacherValidation = [
        body('name')
            .trim()
            .isString()
            .withMessage('Teacher name must be a valid String')
            .bail()
            .isLength({min : 3, max : 30})
            .withMessage('min 3 character and max 30 character')
            ,
        
        body('email')
            .trim()
            .normalizeEmail({ all_lowercase: true})
            .isEmail()
            .withMessage('provide a valid Email address')
            .custom(async value => {
                const user = await getUserByEmail(value);
                if (user) {
                  throw new Error('E-mail already in use');
                }
              })
              ,
        
        body('password')
        .trim()
        .isString().withMessage('password must me a valid String')
        .isLength({min : 4}).withMessage('minimum 4 character')
    ]

    // const addTicketValidation = [
        
    //         body('rootId')
    //         .trim()
    //         .isString()
    //         .withMessage('Root Id must be a valid ID String')
    //         .bail()
    //         .custom(async value => {
    //             const isValid = mongoose.Types.ObjectId.isValid(value);
    //             if (!isValid) {
    //               throw new Error('Use a Valid Root Id');
    //             }
    //           })
    //         ,
    //         body('busId')
    //         .trim()
    //         .isString()
    //         .withMessage('Bus Id must be a valid ID String')
    //         .bail()
    //         .custom(async value => {
    //             const isValid = mongoose.Types.ObjectId.isValid(value);
    //             if (!isValid) {
    //               throw new Error('Use a Valid Bus Id');
    //             }
    //           })
    //         ,
    //         body('date')
    //         .optional()
    //         .trim()
    //         .isString()
    //         .withMessage('Date must be a valid ID String')
    //         .bail()
    //         ,
    //         body('quantity')
    //         .optional()
    //         .isNumeric({ min: 1 })
    //         ,
    //         body('totalPrice')
    //         .optional()
    //         .isNumeric({ min: 0 })
    //     ]

    // const addCityValidation =  [
    //     body('cityName')
    //         .trim()
    //         .isString()
    //         .withMessage('city name must be a valid String')
    //         .bail()
    //         .isLength({min : 3, max : 30})
    //         .withMessage('min 3 character and max 30 character')
    //         ,
    //     body('cityText')
    //     .trim()
    //     .isString()
    //     .toLowerCase()
    //     .withMessage('city Text must be a valid String in LowerCase')
    //     .bail()
    //     .isLength({min : 3, max : 30})
    //     .withMessage('min 3 character and max 30 character')
    //     ,
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
    // const addVehicleValidation = [
    //     body('vehicleName')
    //         .trim()
    //         .isString()
    //         .withMessage('Vahicle name must be a valid String')
    //         .bail()
    //         .isLength({min : 3, max : 30})
    //         .withMessage('min 3 character and max 30 character')
    //         ,
    //     body('vehicleType')
    //     .trim()
    //     .isString()
    //     .bail()
    //     .custom(async value => {
    //         const isValid = mongoose.Types.ObjectId.isValid(value);
    //         if (!isValid) {
    //           throw new Error('Use a Valid Bus Id');
    //         }
    //       })
    //       ,
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

module.exports = {signInValidation, signUpValidation, addTeacherValidation }