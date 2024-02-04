const mongoose=require('mongoose');
const {updateIfCurrentPlugin}=require('mongoose-update-if-current');

const ticketSchema=new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    price:{
        type:Number,
        required: true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        required: true
    },
    orderId:mongoose.Types.ObjectId
});


ticketSchema.set('versionKey','version');
// ticketSchema.plugin(updateIfCurrentPlugin);

const ticketModel=mongoose.model('Ticket',ticketSchema);
module.exports=ticketModel;