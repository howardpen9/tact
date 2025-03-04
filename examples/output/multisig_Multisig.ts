import { Cell, Slice, StackItem, Address, Builder, InternalMessage, CommonMessageInfo, CellMessage, beginCell, serializeDict, TupleSlice4, readString, stringToCell } from 'ton';
import { ContractExecutor, createExecutorFromCode, ExecuteError } from 'ton-nodejs';
import BN from 'bn.js';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function packStateInit(src: StateInit): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeRef(src.code);
    b_0 = b_0.storeRef(src.data);
    return b_0.endCell();
}

export function packStackStateInit(src: StateInit, __stack: StackItem[]) {
    __stack.push({ type: 'cell', cell: src.code });
    __stack.push({ type: 'cell', cell: src.data });
}

export function packTupleStateInit(src: StateInit): StackItem[] {
    let __stack: StackItem[] = [];
    __stack.push({ type: 'cell', cell: src.code });
    __stack.push({ type: 'cell', cell: src.data });
    return __stack;
}

export function unpackStackStateInit(slice: TupleSlice4): StateInit {
    const code = slice.readCell();
    const data = slice.readCell();
    return { $$type: 'StateInit', code: code, data: data };
}
export function unpackTupleStateInit(slice: TupleSlice4): StateInit {
    const code = slice.readCell();
    const data = slice.readCell();
    return { $$type: 'StateInit', code: code, data: data };
}
export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: BN;
    raw: Cell;
}

export function packContext(src: Context): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeBit(src.bounced);
    b_0 = b_0.storeAddress(src.sender);
    b_0 = b_0.storeInt(src.value, 257);
    b_0 = b_0.storeRef(src.raw);
    return b_0.endCell();
}

export function packStackContext(src: Context, __stack: StackItem[]) {
    __stack.push({ type: 'int', value: src.bounced ? new BN(-1) : new BN(0) });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.sender).endCell() });
    __stack.push({ type: 'int', value: src.value });
    __stack.push({ type: 'slice', cell: src.raw });
}

export function packTupleContext(src: Context): StackItem[] {
    let __stack: StackItem[] = [];
    __stack.push({ type: 'int', value: src.bounced ? new BN(-1) : new BN(0) });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.sender).endCell() });
    __stack.push({ type: 'int', value: src.value });
    __stack.push({ type: 'slice', cell: src.raw });
    return __stack;
}

export function unpackStackContext(slice: TupleSlice4): Context {
    const bounced = slice.readBoolean();
    const sender = slice.readAddress();
    const value = slice.readBigNumber();
    const raw = slice.readCell();
    return { $$type: 'Context', bounced: bounced, sender: sender, value: value, raw: raw };
}
export function unpackTupleContext(slice: TupleSlice4): Context {
    const bounced = slice.readBoolean();
    const sender = slice.readAddress();
    const value = slice.readBigNumber();
    const raw = slice.readCell();
    return { $$type: 'Context', bounced: bounced, sender: sender, value: value, raw: raw };
}
export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: BN;
    mode: BN;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function packSendParameters(src: SendParameters): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeBit(src.bounce);
    b_0 = b_0.storeAddress(src.to);
    b_0 = b_0.storeInt(src.value, 257);
    b_0 = b_0.storeInt(src.mode, 257);
    if (src.body !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.body);
    } else {
        b_0 = b_0.storeBit(false);
    }
    if (src.code !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.code);
    } else {
        b_0 = b_0.storeBit(false);
    }
    if (src.data !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.data);
    } else {
        b_0 = b_0.storeBit(false);
    }
    return b_0.endCell();
}

export function packStackSendParameters(src: SendParameters, __stack: StackItem[]) {
    __stack.push({ type: 'int', value: src.bounce ? new BN(-1) : new BN(0) });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.to).endCell() });
    __stack.push({ type: 'int', value: src.value });
    __stack.push({ type: 'int', value: src.mode });
    if (src.body !== null) {
        __stack.push({ type: 'cell', cell: src.body });
    } else {
        __stack.push({ type: 'null' });
    }
    if (src.code !== null) {
        __stack.push({ type: 'cell', cell: src.code });
    } else {
        __stack.push({ type: 'null' });
    }
    if (src.data !== null) {
        __stack.push({ type: 'cell', cell: src.data });
    } else {
        __stack.push({ type: 'null' });
    }
}

export function packTupleSendParameters(src: SendParameters): StackItem[] {
    let __stack: StackItem[] = [];
    __stack.push({ type: 'int', value: src.bounce ? new BN(-1) : new BN(0) });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.to).endCell() });
    __stack.push({ type: 'int', value: src.value });
    __stack.push({ type: 'int', value: src.mode });
    if (src.body !== null) {
        __stack.push({ type: 'cell', cell: src.body });
    } else {
        __stack.push({ type: 'null' });
    }
    if (src.code !== null) {
        __stack.push({ type: 'cell', cell: src.code });
    } else {
        __stack.push({ type: 'null' });
    }
    if (src.data !== null) {
        __stack.push({ type: 'cell', cell: src.data });
    } else {
        __stack.push({ type: 'null' });
    }
    return __stack;
}

export function unpackStackSendParameters(slice: TupleSlice4): SendParameters {
    const bounce = slice.readBoolean();
    const to = slice.readAddress();
    const value = slice.readBigNumber();
    const mode = slice.readBigNumber();
    const body = slice.readCellOpt();
    const code = slice.readCellOpt();
    const data = slice.readCellOpt();
    return { $$type: 'SendParameters', bounce: bounce, to: to, value: value, mode: mode, body: body, code: code, data: data };
}
export function unpackTupleSendParameters(slice: TupleSlice4): SendParameters {
    const bounce = slice.readBoolean();
    const to = slice.readAddress();
    const value = slice.readBigNumber();
    const mode = slice.readBigNumber();
    const body = slice.readCellOpt();
    const code = slice.readCellOpt();
    const data = slice.readCellOpt();
    return { $$type: 'SendParameters', bounce: bounce, to: to, value: value, mode: mode, body: body, code: code, data: data };
}
export type Request = {
    $$type: 'Request';
    requested: Address;
    to: Address;
    value: BN;
    timeout: BN;
    bounce: boolean;
    mode: BN;
    body: Cell | null;
}

export function packRequest(src: Request): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(4096439811, 32);
    b_0 = b_0.storeAddress(src.requested);
    b_0 = b_0.storeAddress(src.to);
    b_0 = b_0.storeCoins(src.value);
    b_0 = b_0.storeUint(src.timeout, 32);
    b_0 = b_0.storeBit(src.bounce);
    b_0 = b_0.storeUint(src.mode, 8);
    if (src.body !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.body);
    } else {
        b_0 = b_0.storeBit(false);
    }
    return b_0.endCell();
}

export function packStackRequest(src: Request, __stack: StackItem[]) {
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.requested).endCell() });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.to).endCell() });
    __stack.push({ type: 'int', value: src.value });
    __stack.push({ type: 'int', value: src.timeout });
    __stack.push({ type: 'int', value: src.bounce ? new BN(-1) : new BN(0) });
    __stack.push({ type: 'int', value: src.mode });
    if (src.body !== null) {
        __stack.push({ type: 'cell', cell: src.body });
    } else {
        __stack.push({ type: 'null' });
    }
}

export function packTupleRequest(src: Request): StackItem[] {
    let __stack: StackItem[] = [];
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.requested).endCell() });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.to).endCell() });
    __stack.push({ type: 'int', value: src.value });
    __stack.push({ type: 'int', value: src.timeout });
    __stack.push({ type: 'int', value: src.bounce ? new BN(-1) : new BN(0) });
    __stack.push({ type: 'int', value: src.mode });
    if (src.body !== null) {
        __stack.push({ type: 'cell', cell: src.body });
    } else {
        __stack.push({ type: 'null' });
    }
    return __stack;
}

export function unpackStackRequest(slice: TupleSlice4): Request {
    const requested = slice.readAddress();
    const to = slice.readAddress();
    const value = slice.readBigNumber();
    const timeout = slice.readBigNumber();
    const bounce = slice.readBoolean();
    const mode = slice.readBigNumber();
    const body = slice.readCellOpt();
    return { $$type: 'Request', requested: requested, to: to, value: value, timeout: timeout, bounce: bounce, mode: mode, body: body };
}
export function unpackTupleRequest(slice: TupleSlice4): Request {
    const requested = slice.readAddress();
    const to = slice.readAddress();
    const value = slice.readBigNumber();
    const timeout = slice.readBigNumber();
    const bounce = slice.readBoolean();
    const mode = slice.readBigNumber();
    const body = slice.readCellOpt();
    return { $$type: 'Request', requested: requested, to: to, value: value, timeout: timeout, bounce: bounce, mode: mode, body: body };
}
export type Signed = {
    $$type: 'Signed';
    request: Request;
}

export function packSigned(src: Signed): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(420994549, 32);
    b_0 = b_0.storeCellCopy(packRequest(src.request));
    return b_0.endCell();
}

export function packStackSigned(src: Signed, __stack: StackItem[]) {
    packStackRequest(src.request, __stack);
}

export function packTupleSigned(src: Signed): StackItem[] {
    let __stack: StackItem[] = [];
    __stack.push({ type: 'tuple', items: packTupleRequest(src.request) });
    return __stack;
}

export function unpackStackSigned(slice: TupleSlice4): Signed {
    const request = unpackStackRequest(slice);
    return { $$type: 'Signed', request: request };
}
export function unpackTupleSigned(slice: TupleSlice4): Signed {
    const request = unpackTupleRequest(slice);
    return { $$type: 'Signed', request: request };
}
export async function Multisig_init(members: Cell, totalWeight: BN, requiredWeight: BN) {
    const __code = 'te6ccgECJwEABAUAART/APSkE/S88sgLAQIBYgIDAgLLBAUCASAhIgIBSAYHAgEgDg8CAUgICQIBWAwNAoEcCHXScIflTAg1wsf3gLQ0wMBcbDAAZF/kXDiAfpAIlBmbwT4YQKRW+AgghD0KrYDuuMCghAZF931uuMCMPLAgoAoLAAsIG7y0ICAA3DDtRNDUAfhigQEB1wD0BIEBAdcAgQEB1wBVMGwUBNMfAYIQ9Cq2A7ry4IH6QAEB+kABAfoA0x/SANMHbQHSAAGSMdTeVWA3EJoQiRB4VQXwGsj4QgHMVTBQNIEBAc8A9ACBAQHPAIEBAc8Aye1UAPTtRNDUAfhigQEB1wD0BIEBAdcAgQEB1wBVMGwUBNMfAYIQGRfd9bry4IHTHwGCEPQqtgO68uCB+kABAfpAAQH6ANMf0gDTB20B0gABkjHU3lVgNxCaEIkQeFUF8BvI+EIBzFUwUDSBAQHPAPQAgQEBzwCBAQHPAMntVABHMhwAcsBcwHLAXABywASzMzJ+QDIcgHLAXABywASygfL/8nQgAB0QTP0Cm+hlAHXADDgW22ACASAQEQIBSBscAgFYEhMCASAUFQAVJR/AcoA4HABygCAACRwWfAGgAgEgFhcCASAZGgH3MhxAcoBUAfwEnABygJQBc8WUAP6AnABymgjbrMlbrOxjj1/8BLIcPAScPASJG6zmX/wEgTwAVAEzJU0A3DwEuIkbrOZf/ASBPABUATMlTQDcPAS4nDwEgJ/8BICyVjMljMzAXDwEuIhbrOYf/ASAfABAcyUMXDwEuLJAYBgAsRwcAzIzAwHBVCTUAgGRBRQy88WGfQAF4EBAc8AFYEBAc8AE8oAyEYXEDUYghD0KrYDUAjLH1AGzxZQBM8WWPoCyx/KAMsHIW6UcDLKAJV/AcoAzOLJAczJgAAT7AAA7ArQ9AQwggCTuQGAEPQPb6Hy4GRtyPQAyVWQC/AVgAD0MW1wBMjMUERDE1A0gQEBzwD0AIEBAc8AgQEBzwDJgAgEgHR4CASAfIAAXDRbgQELWIEBAfAHgAAkECNfA4AB1PhBbyQQI18DgQELKwKBAQHwB/ABggC04wHCAPL0+EL4KFQYe1F6B1Uj8BZc8BN/cFBCgEJQQm0C8BSAAZz4QW8kECNfA/hC+ChUIMNUW7pUephTqfAW8BOBEU0IxwUX8vSBEpMD+CO8E/L0BG1t8BSAARbykL2omhqAPwxQICA64B6AkCAgOuAQICA64AqmDYKKoH4DEAgEgIyQCASAlJgAJuzX/AXgAQbcoPaiaGoA/DFAgIDrgHoCQICA64BAgIDrgCqYNgp4DMABNt3owTgudh6ullc9j0J2HOslQo2zQThO6xqWlbI+WZFp15b++LEcw';
    const depends = new Map<string, Cell>();
    depends.set('37817', Cell.fromBoc(Buffer.from('te6ccgECIAEABEkAART/APSkE/S88sgLAQIBYgIDAgLLBAUCASAcHQIBSAYHAgFIEBECAUgICQIBWA4PAn87ftwIddJwh+VMCDXCx/eAtDTAwFxsMABkX+RcOIB+kAiUGZvBPhhApFb4CDAACLXScEhsOMCwACRMOMN8sCCgCgsACwgbvLQgIAGsW+1E0NQB+GL6QAEB9ASBAQHXAIEBAdcA0gDUAdDTHwGCEPQqtgO68uCB+kABAfpAAQH6ANMf0gDTB20B0gABkjHU3lVgNxB8EHsQehB5EHhVBWwc8BQMAfr5AYLwIq7m0KbcFGV3J33VjQauMJCjzdPYqIVhGEIIrl9usDm6jtXtRNDUAfhi+kABAfQEgQEB1wCBAQHXANIA1AHQ0x8BghD0KrYDuvLggfpAAQH6QAEB+gDTH9IA0wdtAdIAAZIx1N5VYDcQfBB7EHoQeRB4VQVsHPAV4A0ApMj4QgHMVbBQy88WGfQAF4EBAc8AFYEBAc8AE8oAyEYXEDUYghD0KrYDUAjLH1AGzxZQBM8WWPoCyx/KAMsHIW6UcDLKAJV/AcoAzOLJAczJ7VQAqMj4QgHMVbBQy88WGfQAF4EBAc8AFYEBAc8AE8oAyEYXEDUYghD0KrYDUAjLH1AGzxZQBM8WWPoCyx/KAMsHIW6UcDLKAJV/AcoAzOLJAczJ7VTbMQAjCFulVtZ9Fkw4MgBzwBBM/RBgAB0QTP0Cm+hlAHXADDgW22ACASASEwIBSBkaAgEgFBUCASAXGAAVJR/AcoA4HABygCAB9zIcQHKAVAH8BBwAcoCUAXPFlAD+gJwAcpoI26zJW6zsY49f/AQyHDwEHDwECRus5l/8BAE8AFQBMyVNANw8BDiJG6zmX/wEATwAVAEzJU0A3DwEOJw8BACf/AQAslYzJYzMwFw8BDiIW6zmH/wEAHwAQHMlDFw8BDiyQGAWAAT7AACxHBwDMjMDAcFUJNQCAZEFFDLzxYZ9AAXgQEBzwAVgQEBzwATygDIRhcQNRiCEPQqtgNQCMsfUAbPFlAEzxZY+gLLH8oAywchbpRwMsoAlX8BygDM4skBzMmAABRsV4AABIAF1IESkyT4I7zy9IIAn2oos/L0+EFvJBAjXwMrgQELIoEBAfAH8AEcgQELUA1tgQEB8AZQq6BTCL7jAAmAbAJ43f3BwgQCCVHmHVHmHVhLIVWCCEBkX3fVQCMsfB4IQ9Cq2A1AIyx9QBs8WUATPFlj6AssfygDLByFulHAyygCVfwHKAMziyS9VIG1t8BEHAAm8FueAlAIBZh4fAK+wv7tRNDUAfhi+kABAfQEgQEB1wCBAQHXANIA1AHQ0x8BghD0KrYDuvLggfpAAQH6QAEB+gDTH9IA0wdtAdIAAZIx1N5VYDcQfBB7EHoQeRB4VQVsHPATgAE2y9GCcFzsPV0srnsehOw51kqFG2aCcJ3WNS0rZHyzItOvLf3xYjmA=', 'base64'))[0]);
    let systemCell = beginCell().storeDict(serializeDict(depends, 16, (src, v) => v.refs.push(src))).endCell();
    let __stack: StackItem[] = [];
    __stack.push({ type: 'cell', cell: systemCell });
    __stack.push({ type: 'cell', cell: members});
    __stack.push({ type: 'int', value: totalWeight });
    __stack.push({ type: 'int', value: requiredWeight });
    let codeCell = Cell.fromBoc(Buffer.from(__code, 'base64'))[0];
    let executor = await createExecutorFromCode({ code: codeCell, data: new Cell() });
    let res = await executor.get('init_Multisig', __stack, { debug: true });
    if (res.debugLogs.length > 0) { console.warn(res.debugLogs); }
    let data = res.stack.readCell();
    return { code: codeCell, data };
}

export const Multisig_errors: { [key: string]: string } = {
    '2': `Stack undeflow`,
    '3': `Stack overflow`,
    '4': `Integer overflow`,
    '5': `Integer out of expected range`,
    '6': `Invalid opcode`,
    '7': `Type check error`,
    '8': `Cell overflow`,
    '9': `Cell underflow`,
    '10': `Dictionary error`,
    '13': `Out of gas error`,
    '32': `Method ID not found`,
    '34': `Action is invalid or not supported`,
    '37': `Not enough TON`,
    '38': `Not enough extra-currencies`,
    '128': `Null reference exception`,
    '129': `Invalid serialization prefix`,
    '130': `Invalid incoming message`,
    '131': `Constraints error`,
    '132': `Access denied`,
    '133': `Contract stopped`,
    '134': `Invalid argument`,
    '4429': `Invalid sender`,
    '4755': `Timeout`,
    '40810': `Completed`,
    '46307': `Not a member`,
}

export class Multisig {
    readonly executor: ContractExecutor; 
    constructor(executor: ContractExecutor) { this.executor = executor; } 
    
    async send(args: { amount: BN, from?: Address, debug?: boolean }, message: Request | Signed) {
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Request') {
            body = packRequest(message);
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Signed') {
            body = packSigned(message);
        }
        if (body === null) { throw new Error('Invalid message type'); }
        try {
            let r = await this.executor.internal(new InternalMessage({
                to: this.executor.address,
                from: args.from || this.executor.address,
                bounce: false,
                value: args.amount,
                body: new CommonMessageInfo({
                    body: new CellMessage(body!)
                })
            }), { debug: args.debug });
            if (r.debugLogs.length > 0) { console.warn(r.debugLogs); }
        } catch (e) {
            if (e instanceof ExecuteError) {
                if (e.debugLogs.length > 0) { console.warn(e.debugLogs); }
                if (Multisig_errors[e.exitCode.toString()]) {
                    throw new Error(Multisig_errors[e.exitCode.toString()]);
                }
            }
            throw e;
        }
    }
    async getMember(address: Address) {
        try {
            let __stack: StackItem[] = [];
            __stack.push({ type: 'slice', cell: beginCell().storeAddress(address).endCell() });
            let result = await this.executor.get('member', __stack, { debug: true });
            if (result.debugLogs.length > 0) { console.warn(result.debugLogs); }
            return result.stack.readBigNumberOpt();
        } catch (e) {
            if (e instanceof ExecuteError) {
                if (e.debugLogs.length > 0) { console.warn(e.debugLogs); }
                if (Multisig_errors[e.exitCode.toString()]) {
                    throw new Error(Multisig_errors[e.exitCode.toString()]);
                }
            }
            throw e;
        }
    }
    async getMembers() {
        try {
            let __stack: StackItem[] = [];
            let result = await this.executor.get('members', __stack, { debug: true });
            if (result.debugLogs.length > 0) { console.warn(result.debugLogs); }
            return result.stack.readCellOpt();
        } catch (e) {
            if (e instanceof ExecuteError) {
                if (e.debugLogs.length > 0) { console.warn(e.debugLogs); }
                if (Multisig_errors[e.exitCode.toString()]) {
                    throw new Error(Multisig_errors[e.exitCode.toString()]);
                }
            }
            throw e;
        }
    }
}