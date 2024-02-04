const {listener} = require('@func1/common1');
const ticketModel = require('../ticketModel');
class orderCreatedListener extends listener {
    queueGroupName='ticket-services';
    subject='order:created';
    constructor(client){
        super(client);
    };
    async onMessage(data,msg){
        const ticketId=data.ticketId;
        const _id=data._id;
        const ticket=await ticketModel.findById(ticketId);
        if( ! ticket ){
            throw new Error('ticket not found');
        };
        ticket.orderId=_id;
        await ticket.save();
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
        const ticketId=data.ticketId;
        const _id=data._id;
        const ticket=await ticketModel.findById(ticketId);
        if( ! ticket ){
            throw new Error('ticket not found');
        };
        ticket.orderId=null;
        await ticket.save();
        msg.ack();
    };
};

module.exports = {orderCreatedListener,orderCancelledListener};