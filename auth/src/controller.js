const {apiError} =require('@func1/common1');
const userModel = require('./userModel');
const jwt=require('jsonwebtoken');
const bcryptjs=require('bcryptjs');
const expressAsyncHandler=require('express-async-handler');
const sendWelcome = require('./sendWelcome');

const signup=expressAsyncHandler( async(req, res,next) => {
    let user=await userModel.findOne({ email:req.body.email  });
    if (user) {
        return next( new apiError("email already in use",400) );
    };
    user=await userModel.create(req.body);
    let payload={ ... user._doc };
    console.log(req.body)
    delete payload.password;
    console.log(payload,process.env.jwt_secret);
    const token=jwt.sign( payload , process.env.jwt_secret , {expiresIn:"30m"} );
    req.session={jwt:token};
    new sendWelcome(user).send();
    res.status(200).json({payload})
} );

const signin=expressAsyncHandler( async ( req, res , next ) => {
    let user=await userModel.findOne({ email: req.body.email });
    console.log(req.body)
    if (!user) {
        return next(new apiError("no user found",400))
    };
    const match=await bcryptjs.compare( req.body.password , user.password );
    if(!match) {
        return next(new apiError("password is not correct",400));
    };
    let payload = { ... user._doc };
    console.log(payload);
    delete payload.password;
    const token = jwt.sign ( payload , process.env.jwt_secret , {expiresIn:"30m"} );
    req.session={jwt:token};
    return res.status(200).json({payload,user});
} );
const currentUser=expressAsyncHandler( async ( req, res , next ) => {

    return res.status(200).json({ user : req.currentUser });
} );
const logout=expressAsyncHandler( async ( req, res , next ) => {
    req.session={};
    res.status(200).json({status:'success'});
} );

module.exports = {currentUser,signin,signup,logout};