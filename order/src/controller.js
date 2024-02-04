const { apiError } = require("@func1/common1");
const { orderCreated, orderCancelled } = require("./events/orderPublisher");
const orderModel = require("./models/orderModel");
const ticketModel = require("./models/ticketModel");
const asyncHandler=require('express-async-handler');
const wrapperInstance = require("./events/natsWrapper");

const createOrder = asyncHandler ( async ( req,res,next ) => {
    const ticket= await ticketModel.findById( req.body.ticketId );
    if( ! ticket  ){
        return next(new apiError ('can not find ticket',400) );
    }
    let order=await orderModel
        .findOne( { ticketId : req.body.ticketId , status : { $ne : 'canceled' } } );
    if( order ){
        return next(new apiError ('ticket is reserved',400) );
    };
    req.body.price=ticket.price;
    req.body.status= 'created';
    req.body.userId= req.currentUser._id; 
    order=await orderModel.create(req.body);
    
    new orderCreated(wrapperInstance.client).publish(order);
    res.status(200).json({order});
});

const deleteOrder = asyncHandler ( async ( req,res,next ) => {
    const order= await orderModel.findById( req.params.id );
    if( ! order  ){
        return next(new apiError ('can not find order',400) );
    }
    if ( order.userId.toString() !== req.currentUser._id.toString() ){
        return next(new apiError ('you are not allowed',400));
    };
    order.status = 'cancelled';
    await order.save();
    new orderCancelled(wrapperInstance.client).publish(order);
    res.status(200).json({status:"success"});
});

const getOrder = asyncHandler ( async ( req,res,next ) => {
    const order= await orderModel.findById( req.params.id );
    if( ! order  ){
        return next(new apiError ('can not find order',400) );
    }
    if ( order.userId.toString() !== req.currentUser._id.toString() ){
        return next(new apiError ('you are not allowed',400));
    };
    res.status(200).json({order});
});

const getAllOrders = asyncHandler ( async ( req,res,next ) => {
    const orders= await orderModel.find( { userId: req.currentUser._id } );
    res.status(200).json({orders});
});

module.exports = {getOrder,getAllOrders,createOrder,deleteOrder};