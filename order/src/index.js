const express=require('express');
const app = express();
const { errorHandler,routesHandler }=require('@func1/common1');
const cookieSession=require('cookie-session');
const mongoose=require('mongoose');
const router=require('./route');
const wrapperInstance = require('./events/natsWrapper');
const { ticketCreatedListener, ticketUpdatedListener, orderExpirationCompletedListener, chargeCreatedListener } = require('./events/orderListener');

app.use( cookieSession({signed:false}) );

app.use( express.json() );
app.use('/order', router);
app.all('*', routesHandler);
app.use(errorHandler);

async function start(app){
    try {
        await mongoose.connect('mongodb://order-mongo-service:27017/order');
        await wrapperInstance.connect('ticketing','12okrxder','http://nats-srv:4222');
    } catch(e) {
        console.log(e);
    };
    wrapperInstance.client.on('close',()=>{
        process.exit();
    });

    new ticketCreatedListener(wrapperInstance.client).listen();
    new ticketUpdatedListener(wrapperInstance.client).listen();
    new orderExpirationCompletedListener(wrapperInstance.client).listen();
    new chargeCreatedListener(wrapperInstance.client).listen();
    app.listen(3002, () => {
        console.log('Listening on port 3002!!!!!!!!');
    });
};
process.on('unhandledRejection', (e) => {
    console.log(e);
    process.exit(1);
});
process.on('uncaughtException', (e) => {
    console.log(e);
    process.exit(1);
});
start(app);