const {validationHandler}=require('@func1/common1');
const {check}=require('express-validator');
const signupValidator=[
    check('email').notEmpty().withMessage('email is required')
    .isEmail().withMessage('please enter a valid email'),
    check('password').notEmpty().withMessage('password is required')
    .isString().withMessage('password must be a string')
    .isLength({min:6}).withMessage('password must be at least 6 characters')
    ,validationHandler
];
const loginValidator=[
    check('email').notEmpty().withMessage('email is required'),
    check('password').notEmpty().withMessage('password is required')
    ,validationHandler
];
module.exports ={ loginValidator , signupValidator };