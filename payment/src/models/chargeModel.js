const mongoose=require('mongoose');
const chargeSchema=new mongoose.Schema({
    orderId:{
        type:mongoose.Types.ObjectId,
        required: true
    },
    price : {
        type: Number,
        required: true
    }
});
const chargeModel=mongoose.model('Order',chargeSchema);
module.exports=chargeModel;