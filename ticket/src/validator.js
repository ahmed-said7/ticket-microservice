const {validationHandler}=require('@func1/common1');
const {check}=require('express-validator');

const createTicketValidator=[
    check('title').notEmpty().withMessage('ticket title is required')
    .isString().withMessage('ticket title must be a string'),
    check('price').notEmpty().withMessage('ticket price is required')
    .isFloat({gt:0}).withMessage('ticket price must be a number greater than zero'),
    validationHandler
];
const updateTicketValidator=[
    check('id').isMongoId().withMessage('ticket id must be a mongo id'),
    check('title').optional()
    .isString().withMessage('ticket title must be a string'),
    check('price').optional()
    .isFloat({gt:0}).withMessage('ticket price must be a number greater than zero'),
    validationHandler
];

const getTicketValidator=[
    check('id').isMongoId().withMessage('ticket id must be a mongo id'),
    validationHandler
];

const deleteTicketValidator=[
    check('id').isMongoId().withMessage('ticket id must be a mongo id'),
    validationHandler
];

module.exports ={ 
    createTicketValidator,
    getTicketValidator,updateTicketValidator,
    deleteTicketValidator }