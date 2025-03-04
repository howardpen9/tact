import { packTransferMessage, Wallet_init } from "./output/wallet-opt_Wallet";
import { mnemonicNew, mnemonicToWalletKey, sign } from 'ton-crypto';
import { createExecutorFromCode, ExecuteError } from "ton-nodejs";
import { beginCell, Cell, CellMessage, CommonMessageInfo, InternalMessage, toNano } from "ton";
import BN from "bn.js";

describe('wallet-opt', () => {
    it('should deploy', async () => {

        // Create wallet
        let mnemonic = await mnemonicNew(24);
        let key = await mnemonicToWalletKey(mnemonic);
        let pk = new BN(key.publicKey.toString('hex'), 'hex');
        let init = await Wallet_init(pk, new BN(0));

        // Create executor
        let executor = await createExecutorFromCode(init);
        expect((await executor.get('publicKey')).stack.readBigNumber().toString('hex')).toBe(pk.toString(16));
        expect((await executor.get('walletId')).stack.readNumber()).toBe(0);
        expect((await executor.get('seqno')).stack.readNumber()).toBe(0);

        // Try send

        let transfer = new Cell();
        new InternalMessage({ to: executor.address, value: toNano(10), bounce: false, body: new CommonMessageInfo() }).writeTo(transfer);
        let pgk = beginCell()
            .storeUint(0, 32)
            .storeUint(0, 8)
            .storeRef(transfer)
            .endCell();
        let signed = sign(pgk.hash(), key.secretKey);

        try {
            let res = await executor.internal(new InternalMessage({
                to: executor.address,
                from: executor.address,
                bounce: false,
                value: toNano(10),
                body: new CommonMessageInfo({
                    body: new CellMessage(packTransferMessage({
                        $$type: 'TransferMessage',
                        signature: beginCell().storeBuffer(signed).endCell(),
                        transfer: pgk,
                    }))
                })
            }));
            // console.warn(res);
        } catch (e) {
            if (e instanceof ExecuteError) {
                console.warn(e.debugLogs);
            }
            throw e;
        }
    });
});