const ticketModel=require('./ticketModel');
const {apiError}=require('@func1/common1');
const expressAsyncHandler=require('express-async-handler');
const { ticketCreatedPublisher, ticketUpdatedPublisher } = require('./events/ticketPublisher');
const wrapperInstance = require('./events/natsWrapper');



const createTicket = expressAsyncHandler( async (req,res,next) => {
    req.body.userId=req.currentUser._id;
    const ticket=await ticketModel.create(req.body);
    console.log(ticket);
    if(! ticket){
        return next(new apiError('can not create a ticket',400));
    };
    const data={ userId: ticket.userId,_id:ticket._id,
        price: ticket.price,title:ticket.title,version:ticket.version };
    new ticketCreatedPublisher(wrapperInstance.client).publish(data);
    return res.status(201).json({ ticket });
} );

const getTicket = expressAsyncHandler( async (req,res,next) => {
    const ticket=await ticketModel.findById(req.params.id);
    if(! ticket){
        return next(new apiError('can not find a ticket',400));
    };
    return res.status(201).json({ ticket });
} );

const deleteTicket = expressAsyncHandler( async (req,res,next) => {
    const ticket=await ticketModel.findByIdAndDelete(req.params.id);
    if(! ticket){
        return next(new apiError('can not find a ticket',400));
    };
    return res.status(201).json({ status: "deleted" });
} );

const updateTicket = expressAsyncHandler( async (req,res,next) => {
    const ticket=await ticketModel.findByIdAndUpdate(req.params.id,req.body,{new:true});
    if(! ticket){
        return next(new apiError('can not find a ticket',400));
    }; 
    if(ticket.orderId){
        return next(new apiError('ticket is reserved',400));
    };
    if( ticket.userId.toString() != req.currentUser._id.toString() ){
        return next(new apiError('you are not allowed',400));
    };
    ticket.version += 1;
    await ticket.save();
    const data={ userId: ticket.userId,_id:ticket._id,
        price: ticket.price,title:ticket.title,version:ticket.version };
    new ticketUpdatedPublisher(wrapperInstance.client).publish(data);
    return res.status(201).json({ ticket });
} );

const getAllTickets= expressAsyncHandler( async (req,res,next) => {
    const tickets=await ticketModel.find({});
    res.status(201).json({ tickets });
} );
module.exports={getAllTickets,updateTicket,createTicket,getTicket,deleteTicket};