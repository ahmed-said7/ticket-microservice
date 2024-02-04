const mongoose=require('mongoose');
const orderSchema=new mongoose.Schema({
    status:{
        type:String,
        enum:['cancelled','pending','completed','created'],
        default :"created"
    },
    userId:{
        type:mongoose.Types.ObjectId,
        required: true
    },
    price : {
        type: Number,
        required: true
    }
});
const orderModel=mongoose.model('Order',orderSchema);
module.exports=orderModel;