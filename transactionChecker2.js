const Web3 = require("web3");

class TransactionChecker{
    web3;
    web3ws; // We need web3 webservice provider of infura
    account;
    subscription;


    constructor(projectID,account){
        this.web3ws= new Web3(new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws/v3/"+projectID));
        this.web3= new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/" +projectID));
        this.account=account.toLowerCase();
    }

    // the first method of the class is subscribe and it takes a parameter as topic

    subscribe(topic){
        this.subscription= this.web3ws.eth.subscribe(topic,(err,res)=>{
            console.log(err);
        });
    }

    watchTransactions(){
        console.log('Watching transactions ...');
        this.subscription.on('data', (txHash)=>{
            setTimeout(async ()=>{
                try {
                    let tx= await this.web3.eth.getTransaction(txHash);
                    if(tx != null){
                        console.log(tx.from);
                        if(this.account == tx.to.toLowerCase()){
                            console.log(
                                {
                                    address: tx.from,
                                    value: this.web3.utils.fromWei(tx.value,'ether'),
                                    timeStamp: new Date()
                                }
                            );
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            },5*60000);
        });
    }
}

let checker= new TransactionChecker('6ab8cad0c04c4475b2bc1cc531bed79c','0xd9BBE0F231fdBA049422212a57C509D63D426B76');

checker.subscribe('pendingTransactions');
checker.watchTransactions();