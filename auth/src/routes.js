const router=require('express').Router();
const controller = require('./controller');
const validator=require('./validator');
const {protected,allowedTo} = require('@func1/common1');

router.route('/signup').post(
    // validator.signupValidator
    // ,
    controller.signup);
router.route('/login').post(validator.loginValidator,controller.signin);
router.use( protected );
// router.use( allowedTo('user','admin') );
router.route('/get-me').get(protected,allowedTo('user','admin'),controller.currentUser);
router.route('/logout').patch(controller.logout);

module.exports = router;