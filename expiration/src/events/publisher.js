const { publisher }=require('@func1/common1');
class expirationCompletedPublisher extends publisher {
    subject='expiration:complete';
    constructor(client){
        super(client);
    };
};
module.exports = expirationCompletedPublisher;
