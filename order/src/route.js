const router=require('express').Router();
const {protected,allowedTo}=require('@func1/common1');
const controller=require('./controller');

router.use(protected);
router.use(allowedTo('user','admin'));
router.route('/')
    .get(controller.getAllOrders)
    .post(controller.createOrder);

router.route('/:id')
    .get(controller.getOrder)
    .patch(controller.deleteOrder);

module.exports=router;