import { Context } from '../../context';
import { PushNum, PushStr, PushTemp, PushFunc } from '../vm/op/push';
import { Store } from '../vm/op/store';
import { Load } from '../vm/op/load';
import { Allocate } from '../vm/op/allocate';
import { Call } from '../vm/op/call';
import { TempCC } from '../vm/op/tempcc';
import { TempChild } from '../vm/op/tempchild';
import { Cmp } from '../vm/op/cmp';
import { Jump, JumpIfOne } from '../vm/op/jump';
import { Add } from '../vm/op/add';
import { Noop } from '../vm/op/noop';
import { Op } from '../vm/op';
import { Template } from '../../template';
import { Constants, Script } from '../vm/script';
import { System } from '../';

const spawnCode: Op<Context, System<Context>>[] = [
    new PushTemp(0),
    new PushStr(0),
    new PushFunc(0),
    new Call(2)
];

const spawnFuncCode: Op<Context, System<Context>>[] = [
    new Store(0),     // 1:  set $0 to the parent address
    new Store(1),     // 2:  set $1 to the template
    new Load(1),      // 3:  put the template back on the stack.
    new Load(0),      // 4:  put the parent address back on the stack.        
    new Allocate(),   // 5:  allocate the context for the actor.
    new Store(2),     // 6:  set $2 to the created context's address.
    new Load(1),      // 7:  put the template back on the stack.
    new TempCC(),     // 8:  count the number of child templates.
    new Store(3),     // 9:  set $3 to the count of children.
    new PushNum(0),   // 10: put literal 0 on the stack
    new Store(4),     // 11: set $4 to the counter (0).
    new Load(3),      // 12: put the count of the children back on the stack.
    new Load(4),      // 13: put the counter back on the stack.
    new Cmp(),        // 14: Compare the count and counter.
    new JumpIfOne(26),// 15: jump if counter is equal to child count
    new Load(4),      // 16: put the counter back on the stack.
    new Load(1),      // 17: put the template on the stack.
    new TempChild(),  // 18: put the child template at counter on the heap.
    new Load(2),      // 19: put the spawned address on the stack.
    new Call(2),      // 20: call the spawn function (recurse).
    new Load(4),      // 21: put the counter back on the stack.     
    new PushNum(1),   // 22: push literal 1 on the stack.
    new Add(),        // 23: increment the counter.
    new Store(4),     // 24: set $4 to the new counter value.
    new Jump(12),     // 25: jump to op 12
    new Noop()        // 26: do nothing (return)
];

/**
 * SpawnScript for spawning new actors and children from templates.
 */
export class SpawnScript<C extends Context, S extends System<C>>
    extends Script<C, S> {

    constructor(public tmp: Template<C, S>) {

        super(
            <Constants<C, S>>[[], [], [() => spawnFuncCode], [tmp], [], []],
            spawnCode);

    }

}
