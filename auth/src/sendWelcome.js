const {sendMail} =require('@func1/common1');

class sendWelcome extends sendMail {
    constructor(user){
        super(user);
    };
    send(){
        const opts={
            from:"ticket",
            to:this.user.email,
            subject:"Welcome to our application"
        };
        this.sendMail(opts);
    };
};
module.exports = sendWelcome;