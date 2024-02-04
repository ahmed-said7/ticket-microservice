const queue=require('bull');
const wrapperInstance = require('../events/natsWrapper');
const expirationCompletedPublisher = require('../events/publisher');

const expirationQueue
    =new queue( 'order:expiration' , {redis:{host:"expiration-redis-srv"}} );

expirationQueue.process( async (jop) => {
    console.log(jop);
    new expirationCompletedPublisher(wrapperInstance.client)
        .publish({orderId:jop.data.orderId});
} );
module.exports = expirationQueue;