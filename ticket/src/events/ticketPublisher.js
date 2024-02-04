const { publisher }=require('@func1/common1');
class ticketCreatedPublisher extends publisher {
    subject='ticket:created';
    constructor(client){
        super(client);
    };
};
class ticketUpdatedPublisher extends publisher {
    subject='ticket:updated';
    constructor(client){
        super(client);
    };
};

module.exports={ticketUpdatedPublisher,ticketCreatedPublisher};
