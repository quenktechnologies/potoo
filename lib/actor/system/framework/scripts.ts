import { Context } from '../../context';
import { Address } from '../../address';
import { Template } from '../../template';
import { PushNum, PushStr, PushTemp, PushFunc } from '../vm/op/push';
import { Store } from '../vm/op/store';
import { Load } from '../vm/op/load';
import { Allocate } from '../vm/op/allocate';
import { Run } from '../vm/op/run';
import { Call } from '../vm/op/call';
import { TempCC } from '../vm/op/tempcc';
import { TempChild } from '../vm/op/tempchild';
import { Cmp } from '../vm/op/cmp';
import { Jump, JumpIfOne } from '../vm/op/jump';
import { Add } from '../vm/op/add';
import { Noop } from '../vm/op/noop';
import { Op } from '../vm/op';
import { Constants, Script } from '../vm/script';
import { System } from '../';

const spawnCode: Op<Context, System<Context>>[] = [
    new PushStr(0),
    new PushTemp(0),
    new PushFunc(0),
    new Call(2)
];

const spawnFuncCode: Op<Context, System<Context>>[] = [
    new Store(0),     // 0:  set $0 to the parent address
    new Store(1),     // 1:  set $1 to the template
    new Load(1),      // 2:  put the template back on the stack.
    new Load(0),      // 3:  put the parent address back on the stack.        
    new Allocate(),   // 4:  allocate the context for the actor.
    new Store(2),     // 5:  set $2 to the created context's address.
    new Load(2),      // 6:  put the address back on the stack.
    new Run(),        // 7:  invoke the actors run method.
    new Load(1),      // 8:  put the template back on the stack.
    new TempCC(),     // 9:  count the number of child templates.
    new Store(3),     // 10: set $3 to the count of children.
    new PushNum(0),   // 11: put literal 0 on the stack
    new Store(4),     // 12: set $4 to the counter (0).
    new Load(3),      // 13: put the count of the children back on the stack.
    new Load(4),      // 14: put the counter back on the stack.
    new Cmp(),        // 15: Compare the count and counter.
    new JumpIfOne(27),// 16: jump if counter is equal to child count
    new Load(4),      // 17: put the counter back on the stack.
    new Load(1),      // 18: put the template on the stack.
    new TempChild(),  // 19: put the child template at counter on the heap.
    new Load(2),      // 20: put the spawned address on the stack.
    new Call(2),      // 21: call the spawn function (recurse).
    new Load(4),      // 22: put the counter back on the stack.     
    new PushNum(1),   // 23: push literal 1 on the stack.
    new Add(),        // 24: increment the counter.
    new Store(4),     // 25: set $4 to the new counter value.
    new Jump(13),     // 26: jump to op 12
    new Noop()        // 27: do nothing (return)
];

/**
 * SpawnScript for spawning new actors and children from templates.
 */
export class SpawnScript<C extends Context, S extends System<C>>
    extends Script<C, S> {

    constructor(public parent: Address, public tmp: Template<C, S>) {

        super(
            <Constants<C, S>>[[], [parent], [() => spawnFuncCode], [tmp], [], []],
            spawnCode);

    }

}
