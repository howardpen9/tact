import { Cell, Slice, StackItem, Address, Builder, InternalMessage, CommonMessageInfo, CellMessage } from 'ton';
import { ContractExecutor } from 'ton-nodejs';
import BN from 'bn.js';
import { deploy } from '../abi/deploy';

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: BigInt;
    mode: BigInt;
    body: Cell | null;
}

export function packSendParameters(src: SendParameters): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeBit(src.bounce);
    b_0 = b_0.storeAddress(src.to);
    b_0 = b_0.storeInt(new BN(src.value.toString(10), 10), 257);
    b_0 = b_0.storeInt(new BN(src.mode.toString(10), 10), 257);
    if (src.body !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.body);
    } else {
        b_0 = b_0.storeBit(false);
    }
    return b_0.endCell();
}

export type Transfer = {
    $$type: 'Transfer';
    seqno: BigInt;
    mode: BigInt;
    to: Address;
    amount: BigInt;
    body: Cell | null;
}

export function packTransfer(src: Transfer): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(new BN(src.seqno.toString(10), 10), 32);
    b_0 = b_0.storeUint(new BN(src.mode.toString(10), 10), 8);
    b_0 = b_0.storeAddress(src.to);
    b_0 = b_0.storeCoins(new BN(src.amount.toString(10), 10));
    if (src.body !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.body);
    } else {
        b_0 = b_0.storeBit(false);
    }
    return b_0.endCell();
}

export type TransferMessage = {
    $$type: 'TransferMessage';
    signature: Slice;
    transfer: Transfer;
}

export function packTransferMessage(src: TransferMessage): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(1843760589, 32);
    b_0 = b_0.storeRef(src.signature.toCell());
    b_0 = b_0.storeCellCopy(packTransfer(src.transfer));
    return b_0.endCell();
}

export function Wallet_init(key: BigInt, walletId: BigInt) {
    const __code = 'te6ccgECLAEAAgwAART/APSkE/S88sgLAQIBYgIDAgLLBAUCASAmJwIBIAYHAgFiIiMCASAICQIBIBYXAgEgCgsCASAQEQIBIAwNAgEgDg8APQx0x/tRNDwCjECghBt5Y3NupfwBzHwEvAM4FvywGSAACQgbvJOgAA8+kAB+kRvAoAApHJYywFwAcsAIW8QAcoHAW8RAcv/gAgEgEhMCASAUFQA7G8lUEXLHxLLBwHwAwH6AiFulHAyygCVfwHKAMzigAAsyAHwBMmAALTTH9MH8AIB+gBtAdIAAZLUMd5VQG8FgABM1AHQAfAGEm8CgAgEgGBkCASAcHQIBIBobABVNMf0//TP1UgbwOAAVG8jUCPLH8v/yz+AACzIAfAIyYAIBIB4fAgEgICEADzIAfAIye1UgAH0yHEBygEhbxABygBwAcoCIW8R8AMhbxL6AnABymhwAcoAIW8UIG6zmX9YygAB8AEBzJUwcAHKAOLJAW8T+wCAAHxwbW1vA1hxb4cBcm+H8AmAABwgbxGACASAkJQB3QgbxEg8AX5AAJvECNvERAj+RDyqiBvECJvELryqyFvEKQScG+HfyJvEiNvEyRvEQVvFBA0QTAVbwXwDYAAcIG8SgAAcIG8QgAgEgKCkAF74CV2omh4BRj4CBjAAJu6E/AOgCAUgqKwAXsyX7UTQ8Aox8BExgABewfjtRNDwCjHwDzGA=';
    let __stack: StackItem[] = [];
    __stack.push({ type: 'int', value: new BN(key.toString(), 10)});
    __stack.push({ type: 'int', value: new BN(walletId.toString(), 10)});
    return deploy(__code, 'init_Wallet', __stack);
}

export class Wallet {
    readonly executor: ContractExecutor;
    constructor(executor: ContractExecutor) { this.executor = executor; }
    
    async send(args: { amount: BN, from?: Address, debug?: boolean }, message: TransferMessage) {
        let body: Cell | null = null;
        if (message.$$type === 'TransferMessage') {
            body = packTransferMessage(message);
        }
        if (body === null) { throw new Error('Invalid message type'); }
        await this.executor.internal(new InternalMessage({
            to: this.executor.address,
            from: args.from || this.executor.address,
            bounce: false,
            value: args.amount,
            body: new CommonMessageInfo({
                body: new CellMessage(body!)
            })
        }), { debug: args.debug });
    }
    async getPublicKey() {
        let __stack: StackItem[] = [];
        let result = await this.executor.get('publicKey', __stack);
        return result.stack.readBigNumber();
    }
    async getWalletId() {
        let __stack: StackItem[] = [];
        let result = await this.executor.get('walletId', __stack);
        return result.stack.readBigNumber();
    }
    async getSeqno() {
        let __stack: StackItem[] = [];
        let result = await this.executor.get('seqno', __stack);
        return result.stack.readBigNumber();
    }
}