const {listener} = require('@func1/common1');
const ticketModel = require('../models/ticketModel');
const orderModel = require('../models/orderModel');
const { orderCancelled } = require('./orderPublisher');
const wrapperInstance = require('./natsWrapper');

class ticketCreatedListener extends listener {
    queueGroupName='order-services';
    subject='ticket:created';
    constructor(client){
        super(client);
    };
    async onMessage(data,msg){
        const _id=data._id;
        const title=data.title;
        const price=data.price;
        const userId=data.userId;
        const ticket=await ticketModel.create({_id,title,price,userId});
        msg.ack();
    };
};
class ticketUpdatedListener extends listener {
    queueGroupName='order-services';
    subject='ticket:updated';
    constructor(client){
        super(client);
    };
    async onMessage(data,msg){
        const _id=data._id.toString();
        const ticket=await ticketModel.findOne({_id , version:data.version-1});
        if( ! ticket  ){
            throw new Error('No such ticket');
        };
        delete data.userId;
        delete data._id;
        const keys=Object.keys(data);
        keys.forEach (  key  => ticket[key] = data[key] );
        await ticket.save();
        console.log('Begin listen to !!!!!!!!!!!!!');
        console.log(ticket);
        msg.ack();
    };
};

class chargeCreatedListener extends listener {
    queueGroupName='order-services';
    subject='charge:created';
    constructor(client){
        super(client);
    };
    async onMessage(data,msg){
        const _id=data.orderId;
        const order=await orderModel.findOne({_id});
        if( ! order ){
            throw new Error('can not find order',400);
        }
        order.status='completed';
        await order.save();
        msg.ack();
    };
};



class orderExpirationCompletedListener extends listener {
    queueGroupName='order-services';
    subject='expiration:completed';
    constructor(client){
        super(client);
    };
    async onMessage(data,msg){
        const _id=data.orderId;
        const order=await orderModel.findOne({_id,status:{$in:['created','pending']}});
        if( ! order ){
            console.log('Order not found may be paid or cancelled');
        }else {
            order.status='cancelled';
            await order.save();
            new orderCancelled(wrapperInstance.client).publish(order);
        };
        msg.ack();
    };
};

module.exports = 
        {
    ticketCreatedListener
    ,orderExpirationCompletedListener
    ,ticketUpdatedListener,chargeCreatedListener
        };