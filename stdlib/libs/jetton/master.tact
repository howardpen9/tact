import "@stdlib/ownable";
import "./messages";

@interface("org.ton.jetton.master")
trait Jetton with Ownable {

    //
    // Storage
    //

    totalSupply: Int;
    mintable: Bool;
    owner: Address;
    content: Cell?;

    //
    // Receivers
    //

    receive(msg: TokenUpdateContent) {

        // Allow changing content only by owner
        self.requireOwner();
        
        // Update content
        self.content = msg.content;
    }

    receive(msg: TokenBurnNotification) {
        
        // Check wallet
        self.requireWallet(msg.owner);

        // Update supply
        self.totalSupply = self.totalSupply - msg.amount;

        // Cashback
        if (msg.responseAddress != null) {
            send(SendParameters{
                to: msg.responseAddress, 
                value: 0,
                bounce: false,
                mode: SendRemainingValue + SendIgnoreErrors,
                body: abi.pack_cell(TokenExcesses{
                    queryId: msg.queryId
                })
            });
        }
    }


    //
    // Get Methods
    //

    get fun get_wallet_address(owner: Address): Address {
        let winit: StateInit = self.getJettonWalletInit(owner);
        return contractAddress(winit);
    }

    get fun get_jetton_data(): JettonData {
        return JettonData{ 
            totalSupply: self.totalSupply, 
            mintable: self.mintable, 
            owner: self.owner, 
            content: self.content, 
            walletCode: self.getJettonWalletInit(myAddress()).code
        };
    }

    //
    // Private Methods
    //

    fun mint(to: Address, amount: Int, responseAddress: Address?) {

        // Update total supply
        self.totalSupply = self.totalSupply + amount;

        // Create message
        let winit: StateInit = self.getJettonWalletInit(to);
        let walletAddress: Address = contractAddress(winit);
        send(SendParameters{
            to: walletAddress, 
            value: 0, 
            bounce: false,
            mode: SendRemainingValue,
            body: abi.pack_cell(TokenTransferInternal{ 
                amount: amount,
                queryId: 0,
                from: myAddress(),
                responseAddress: responseAddress,
                forwardTonAmount: 0,
                forwardPayload: emptySlice()
            }),
            code: winit.code,
            data: winit.data
        });
    }

    fun requireWallet(owner: Address) {
        let ctx: Context = context();
        let winit: StateInit = self.getJettonWalletInit(owner);
        require(contractAddress(winit) == ctx.sender, "Invalid sender");
    }

    virtual fun getJettonWalletInit(address: Address): StateInit {
        return initOf JettonDefaultWallet(myAddress(), address);
    }
}