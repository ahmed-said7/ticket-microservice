const mongoose= require('mongoose');
const bcryptjs= require('bcryptjs');
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:[6,'password min length is 6'],
    },
    role:{
        type:String,enum:['user','admin'],
        default:'user'
    }
});
userSchema.pre('save',async function(next){
    if( this.isModified('password') ){
        this.password=await bcryptjs.hash(this.password,10);
    };
    return next();
})
const userModel=mongoose.model('User',userSchema);
module.exports=userModel;