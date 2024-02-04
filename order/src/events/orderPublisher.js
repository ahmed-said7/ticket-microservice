const {publisher} =require('@func1/common1');
class orderCreated extends publisher {
    subject='order:created';
    constructor(client){
        super(client);
    };
}; 
class orderCancelled extends publisher {
    subject='order:cancelled';
    constructor(client){
        super(client);
    };
}; 
module.exports = { orderCancelled , orderCreated };