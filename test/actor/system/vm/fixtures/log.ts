import { Type } from '@quenk/noni/lib/data/type';

import { Mock } from '@quenk/test/lib/mock';

import { Frame } from '../../../../../lib/actor/system/vm/runtime/stack/frame';
import { Opcode } from '../../../../../lib/actor/system/vm/runtime/op';
import { Operand } from '../../../../../lib/actor/system/vm/runtime';
import { VMThread } from '../../../../../lib/actor/system/vm/thread';
import { LogWritable } from '../../../../../lib/actor/system/vm/log';
import { Address } from '../../../../../lib/actor/address';

export class LogWritableImpl implements LogWritable {

    mock = new Mock();

    /**
     * opcode logs the execution of an opcode once the log level is >=
     * [[LOG_LEVEL_TRACE]].
     */
    opcode(thr: VMThread, frame: Frame, op: Opcode, operand: Operand) {

        return this.mock.invoke('opcode', [thr, frame, op, operand], undefined);

    }

    /**
     * event outputs a system event to the log if predefined [[LogLevel]] for
     * the event is less than or equal to the current log level.
     */
    event(addr: Address, evt: string, ...args: Type[]) {

        return this.mock.invoke('event', [addr, evt, ...args], undefined);

    }

}
