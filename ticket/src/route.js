const router=require('express').Router();
const controller=require('./controller');
const {protected,allowedTo}=require('@func1/common1');
const validator=require('./validator');


router.use(protected);
router.use(allowedTo('user','admin'));
router.route('/').
    post(controller.createTicket)
    .get(controller.getAllTickets);

router.route('/:id').
    patch(controller.updateTicket)
    .get(controller.getTicket)
    .delete(controller.deleteTicket);

module.exports=router;