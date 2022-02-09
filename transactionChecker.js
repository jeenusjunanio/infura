const Web3= require('web3');

class TransactionChecker{
    web3;
    account;
    myAccount;

    constructor(projectID,account){
        // initaialize the
        this.web3=new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/" + projectID));
        this.account=account.toLowerCase();
        
    }

// now we nee to make an asynchronus function to checkthe blocks

    async CheckBlock(){
        // first we need to get the latest block
        let block= await this.web3.eth.getBlock("latest");

        // from above method  the web3 is initialized in constructor with the web3 js.
        // the getBlock is a method to get the block by ID, number or any string like latest or sthng similar like a search query.
        // from get block we need the numbers and the transactions.

        let number= block.number;
        console.log("searching block " +number);

        // now lets check if the block is not null and the transactions also not null. If this is true then we loop through the blocks
        if(block != null && block.transactions !=null){
            // console.log(this.account);
            for(let txHash of block.transactions){
                try {
                    let tx= await this.web3.eth.getTransaction(txHash);
                    if (tx.to && tx.to !== null) {
                        if(this.account == tx.to.toLowerCase()){
                            console.log("Transaction found on block= "+ number);
                            console.log({address: tx.from,value: this.web3.utils.fromWei(tx.value,'ether'),timestamp: new Date()});
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
                
            }
        }
    }
}

let txChecker=new TransactionChecker('6ab8cad0c04c4475b2bc1cc531bed79c','0xd9BBE0F231fdBA049422212a57C509D63D426B76');
setInterval(() => {
    txChecker.CheckBlock();
}, 15 * 1000);