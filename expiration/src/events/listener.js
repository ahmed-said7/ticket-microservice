const {listener} = require('@func1/common1');
const expirationQueue = require('../queue/process');
class orderCreatedListener extends listener {
    queueGroupName='expiration-services';
    subject='order:created';
    constructor(client){
        super(client);
    };
    async onMessage(data,msg){
        const delay=Date.now() - data.expiresIn;
        const orderId=data._id;
        expirationQueue.add({orderId},{delay:6000});
        msg.ack();
    };
};
module.exports = {orderCreatedListener};