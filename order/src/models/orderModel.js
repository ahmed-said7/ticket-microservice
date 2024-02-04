const mongoose=require('mongoose');
const orderSchema=new mongoose.Schema({
    status:{
        type:String,
        enum:['cancelled','pending','completed','created'],
        default :"created"
    },
    ticketId:{
        type: mongoose.Types.ObjectId,
        ref: "Ticket"
    },
    userId:{
        type:mongoose.Types.ObjectId,
        required: true
    },
    price : {
        type: Number,
        required: true
    },
    expiresIn : {
        type: Date,
        default: Date.now()+15*60*1000
    }
});
const orderModel=mongoose.model('Order',orderSchema);
module.exports=orderModel;