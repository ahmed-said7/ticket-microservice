const express=require('express');
const app=express();
const cookieSession=require('cookie-session');
const router = require('./routes');
const {errorHandler,routesHandler,dbconnect}=require('@func1/common1');
const a=require('@func1/common1');


dbconnect('mongodb://auth-mongo-srv:27017/auth');
app.use(express.json());
app.use( cookieSession( { 
    // secure: true 
    // ,
    signed: false 
} ));
app.use('/user', router );
app.all( "*" , routesHandler );
app.use( errorHandler );

dbconnect('mongodb://auth-mongo-srv:27017/auth');


app.listen(3000,()=>{
    console.log('listening on port 3000');
});
