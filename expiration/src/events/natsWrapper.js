const nats=require('node-nats-streaming');
class natsWrapper {
    #client;
    constructor(){};
    get client(){
        if ( ! this.#client ){
            throw new Error('can not access nats client');
        };
        return this.#client;
    };
    connect(clisterId,clientId,url){
        this.#client=nats.connect(clisterId,clientId,{url});
        return new Promise( (resolve, reject) =>{
            this.client.on('connect',()=>{
                resolve();
            })
            this.client.on('error',(e)=>{
                reject(e);
            })
        });
    };
};
const wrapperInstance = new natsWrapper();
module.exports =  wrapperInstance;