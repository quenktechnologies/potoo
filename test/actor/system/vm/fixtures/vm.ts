import { Mock } from '@quenk/test/lib/mock';
import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import { Err } from '@quenk/noni/lib/control/error';

import { System } from '../../../../../lib/actor/system';
import { Template } from '../../../../../lib/actor/template';
import { State } from '../../../../../lib/actor/system/vm/state';
import { Address } from '../../../../../lib/actor/address';
import { PVM_Value, Script } from '../../../../../lib/actor/system/vm/script';
import { Context } from '../../../../../lib/actor/system/vm/runtime/context';
import { Platform } from '../../../../../lib/actor/system/vm';
import { newContext } from './context';

export class FPVM<S extends System> implements Platform {

    state: State = { runtimes: {}, contexts: {}, routers: {}, groups: {} };

    configuration = {};

    mock = new Mock();

    ident(): string {

        return '?';

    }

    allocate(addr: Address, t: Template<System>): Context {

        return this.mock.invoke('allocate', [addr, t], newContext());

    }

    getContext(addr: Address): Maybe<Context> {

        return this.mock.invoke('getContext', [addr], nothing());

    }

    getRouter(addr: Address): Maybe<Context> {

        return this.mock.invoke('getRouter', [addr], nothing());

    }

    putContext(addr: Address, ctx: Context): FPVM<S> {

        return this.mock.invoke('putContext', [addr, ctx], this);

    }

    removeContext(addr: Address): FPVM<S> {

        return this.mock.invoke('removeContext', [addr], this);

    }

    putRoute(target: Address, router: Address): FPVM<S> {

        return this.mock.invoke('putRoute', [target, router], this);

    }

    removeRoute(target: Address): FPVM<S> {

        return this.mock.invoke('removeRoute', [target], this);

    }

    putMember(group: string, addr: Address): FPVM<S> {

        return this.mock.invoke('putRoute', [group, addr], this);

    }

    removeMember(group: string, addr: Address): FPVM<S> {

        return this.mock.invoke('removeGroup', [group, addr], this);

    }

    raise(err: Err): void {

        return this.mock.invoke<undefined>('raise', [err], undefined);

    }

    exec(s: Script): void {

        this.mock.invoke('exec', [s], nothing());

    }

    run(): Maybe<PVM_Value> {

        return this.mock.invoke('run', [], nothing());

    }

}

export const newPlatform = () => new FPVM();
