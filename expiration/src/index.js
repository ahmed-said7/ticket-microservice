const express=require('express');
const { orderCreatedListener } = require('./events/listener');
const wrapperInstance = require('./events/natsWrapper');
const app = express();


async function start(app){
    try {
        await wrapperInstance.connect('ticketing','12esffss','http://nats-srv:4222');
        new orderCreatedListener(wrapperInstance.client).listen();
    }catch(e) {
        console.log(e);
    };
    wrapperInstance.client.on('close',()=>{
        process.exit(1);
    });
    app.listen(3003, () => {
        console.log('Listening on port 3003!!!!!!!!');
    });
};

start(app);