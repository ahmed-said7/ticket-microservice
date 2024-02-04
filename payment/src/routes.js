const router=require('express').Router();
const controller=require('./controller');
const {protected,allowedTo}=require('@func1/common1');
const validator=require('./validator');


router.use(protected);
router.use(allowedTo('user','admin'));
router.route('/').
    get(controller.createSession)

module.exports=router;