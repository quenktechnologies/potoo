import { Mock } from '@quenk/test/lib/mock';
import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import { Err } from '@quenk/noni/lib/control/error';

import { System } from '../../src/actor/system';
import { Actor } from '../../src/actor';
import { Template } from '../../src/actor/template';
import { State } from '../../src/actor/system/state';
import { Runtime } from '../../src/actor/system/vm/runtime';
import { Address } from '../../src/actor/address';
import { PVM_Value, Script } from '../../src/actor/system/vm/script';
import { Platform } from '../../lib/actor/system/vm';
import { Context } from '../../lib/actor/context';
import { newContext } from './context';

export class FPVM<S extends System> extends Mock implements Platform {

    state: State = { contexts: {}, routers: {}, groups: {} };

    configuration = {}

    ident(): string {

        return '?';

    }

    allocate(addr: Address, t: Template<System>): Context {

        return this.MOCK.record('allocate', [addr, t], newContext());

    }

    getContext(addr: Address): Maybe<Context> {

        return this.MOCK.record('getContext', [addr], nothing());

    }

    getRouter(addr: Address): Maybe<Context> {

        return this.MOCK.record('getRouter', [addr], nothing());

    }

    putContext(addr: Address, ctx: Context): FPVM<S> {

        return this.MOCK.record('putContext', [addr, ctx], this);

    }

    removeContext(addr: Address): FPVM<S> {

        return this.MOCK.record('removeContext', [addr], this);

    }

    putRoute(target: Address, router: Address): FPVM<S> {

        return this.MOCK.record('putRoute', [target, router], this);

    }

    removeRoute(target: Address): FPVM<S> {

        return this.MOCK.record('removeRoute', [target], this);

    }

    putMember(group: string, addr: Address): FPVM<S> {

        return this.MOCK.record('putRoute', [group, addr], this);

    }

    removeMember(group: string, addr: Address): FPVM<S> {

        return this.MOCK.record('removeGroup', [group, addr], this);

    }

    raise(err: Err): void {

        return this.MOCK.record('raise', [err], <void>undefined);

    }

    exec(s: Script): void {

        this.MOCK.record('exec', [s], nothing());

    }

    run(): Maybe<PVM_Value> {

        return this.MOCK.record('run', [], nothing());

    }

}
