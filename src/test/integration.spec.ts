import fs from 'fs';
import { CompilerContext } from '../context';
import { __DANGER_resetNodeId } from '../grammar/ast';
import { compile, getContracts, precompile } from '../main';
import { loadCases } from '../utils/loadCases';

describe('integration', () => {
    beforeEach(() => {
        __DANGER_resetNodeId();
    });
    for (let r of loadCases(__dirname + "/contracts/")) {
        it('should resolve expressions for ' + r.name, async () => {
            let ctx = new CompilerContext({ shared: {} });
            ctx = precompile(ctx, __dirname + "/contracts/" + r.name + '.tact');
            let contract = getContracts(ctx)[0];
            let res = await compile(ctx, contract);
            expect(res.output.output).toEqual(fs.readFileSync(__dirname + "/contracts/" + r.name + '.' + contract + '.fc', 'utf8'));
        });
    }
});