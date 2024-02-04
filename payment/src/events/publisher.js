const {publisher} =require('@func1/common1');
class chargeCreated extends publisher {
    subject='charge:created';
    constructor(client){
        super(client);
    };
}; 
module.exports = { chargeCreated };