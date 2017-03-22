import * as Ops from './Ops';
import * as Actor from './Actor';

export const system = () => new Actor.System();
export const spawn = Ops.spawn;
export const tell = Ops.tell;
export const receive = Ops.receive;
export const future = Ops.future;
export const stream = Ops.stream;
export const input = Ops.input;
export const output = Ops.output;
