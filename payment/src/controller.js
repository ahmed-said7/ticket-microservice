const asyncHandler=require('express-async-handler');
const stripe=require('stripe')(process.env.stripe_secret);
const {apiError} = require('@func1/common1');
const orderModel = require('./models/orderModel');
const chargeModel = require('./models/chargeModel');
const { chargeCreated } = require('./events/publisher');
const wrapperInstance = require('./events/nats');
const createSession=asyncHandler( async ( req,res,next ) => {
    const _id=req.body.orderId;
    const order=await orderModel.findOne( { _id , status : { $in : ['created','pending'] } });
    if (!order){
        return next(new apiError('Order not found',400));
    };
    if ( order.userId.toString() !== req.currentUser._id ){
        return next(new apiError('you can not access order',400));
    };
    const session=await stripe.checkout.sessions.create({
        line_items:[
            {
                price_data:
                {
                   currency:"egp" , unit_amount:order.price * 100,
                    product_data:{name:req.currentUser.email}
                },
                quantity:1,
            },
        ],
        mode:"payment",
        success_url:`${req.protocol}://${req.get('host')}/order`,
        cancel_url:`${req.protocol}://${req.get('host')}/cart`,
        client_reference_id:req.body.orderId,
        customer_email:req.currentUser.email
    });
    res.status(200).json({status:"success",data:session});
} );

const createCharge= async ()=>{
    const session=event.data.object;
    const orderId=session.client_reference_id;
    const order=await orderModel({_id:orderId});
    if(!order){
        return next(new apiError('Invalid order',400));
    };
    order.status='completed';
    await chargeModel.create({ orderId:orderId._id , price:order.price });
    new chargeCreated(wrapperInstance.client).publish({orderId:orderId._id});
};
const webhookCheckout= asyncHandler ( async ( req,res,next ) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body,sig,process.env.webhooh_secret);
    } catch (err) {
        console.log(err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
        
    };
    if(event.type === "checkout.session.completed"){
        createCharge(event);
    };
});
module.exports = {webhookCheckout,createSession}