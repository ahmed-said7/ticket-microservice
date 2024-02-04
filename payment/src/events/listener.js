const {listener} = require('@func1/common1');
const orderModel = require('../models/orderModel');
const chargeModel = require('../models/chargeModel');
class orderCreatedListener extends listener {
    queueGroupName='payment-services';
    subject='order:created';
    constructor(client){
        super(client);
    };
    async onMessage(data,msg){
        const price=data.price;
        const userId=data.userId;
        const _id=data._id;
        const status=data.status;
        await orderModel.create({price,userId,status,_id});
        msg.ack();
    };
};

class orderCancelledListener extends listener {
    queueGroupName='ticket-services';
    subject='order:cancelled';
    constructor(client){
        super(client);
    };
    
    async onMessage(data,msg){
        const _id=data._id;
        const order=await orderModel.findById(_id);
        if( ! order ){
            throw new Error('order not found');
        };
        order.status='cancelled';
        await order.save();
        msg.ack();
    };
};

module.exports = {orderCreatedListener,orderCancelledListener};