const express=require('express');
const app = express();
const { errorHandler,apiError,routesHandler }=require('@func1/common1');
const cookieSession=require('cookie-session');
const mongoose=require('mongoose');
const router=require('./route');
const wrapperInstance = require('./events/natsWrapper');
const { orderCancelledListener, orderCreatedListener } = require('./events/ticketListener');
require('./cache');
app.use( cookieSession({signed:false}) );

app.use( express.json() );
app.use('/ticket', router);
app.all('*', routesHandler);
app.use(errorHandler);


async function start(app){
    try {
        await mongoose.connect('mongodb://ticket-mongo-service:27017/ticket');
        await wrapperInstance.connect('ticketing','12ess','http://nats-srv:4222');
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
    app.listen(3001, () => {
        console.log('Listening on port 3001!!!!!!!!');
    });
};


start(app);
process.on('uncaughtException',(err)=>{
    console.log(err);
})
process.on('unhandledRejection',(err)=>{
    console.log(err);
})