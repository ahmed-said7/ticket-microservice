const express=require('express');
const app = express();
const { errorHandler,apiError,routesHandler }=require('@func1/common1');
const cookieSession=require('cookie-session');
const mongoose=require('mongoose');
const router=require('./routes');
const { orderCancelledListener,orderCreatedListener  } = require('./events/listener');
const wrapperInstance = require('./events/nats');
const { webhookCheckout } = require('./controller');

app.use( cookieSession({signed:false}) );

app.use( express.json() );
app.post('/webhook',webhookCheckout);
app.use('/session', router);
app.all('*', routesHandler);
app.use(errorHandler);


async function start(app){
    try {
        await mongoose.connect('mongodb://payment-mongo-service:27017/payment');
        await wrapperInstance.connect('ticketing','12eddss','http://nats-srv:4222');
        new orderCreatedListener(wrapperInstance.client)
            .listen();
        new orderCancelledListener(wrapperInstance.client)
            .listen();
    }catch(e) {
        console.log(e);
    };
    wrapperInstance.client.on('close',()=>{
        process.exit();
    });
    // process.on()
    app.listen(3004, () => {
        console.log('Listening on port 3004!!!!!!!!');
    });
};


start(app);
process.on('uncaughtException',(err)=>{
    console.log(err);
})
process.on('unhandledRejection',(err)=>{
    console.log(err);
})