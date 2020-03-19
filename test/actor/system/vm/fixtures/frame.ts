import { Mock } from '@quenk/test/lib/mock';
import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import { Either, left } from '@quenk/noni/lib/data/either';
import { Err } from '@quenk/noni/lib/control/error';

import {
    PScript,
    PVM_Value,
    PVM_Function,
    PVM_Object,
    PVM_Template
} from '../../../../../lib/actor/system/vm/script';
import { Frame } from '../../../../../lib/actor/system/vm/runtime/stack/frame';
import { ConstructorInfo } from '../../../../../lib/actor/system/vm/script/info';
import { Heap } from '../../../../../lib/actor/system/vm/runtime/heap';
import { newContext } from './context';

export class FrameImpl implements Frame {

    constructor(
        public name = 'main',
        public script = new PScript(),
        public context = newContext(),
        public heap = new Heap(),
        public code = [],
        public data = [],
        public rdata = [],
        public locals = [],
        public ip = 0) { }

    mock = new Mock();

    push(d: number): Frame {

        return this.mock.invoke<Frame>('push', [d], this);

    }

    pushUInt8(value: number): Frame {

        return <Frame>this.mock.invoke('pushUInt8', [value], this);

    }

    pushUInt16(value: number): Frame {

        return <Frame>this.mock.invoke('pushUInt16', [value], this);

    }

    pushUInt32(value: number): Frame {

        return <Frame>this.mock.invoke('pushUInt32', [value], this);

    }

    pushString(idx: number): Frame {

        return <Frame>this.mock.invoke('pushString', [idx], this);

    }

    pushSymbol(idx: number): Frame {

        return <Frame>this.mock.invoke('pushSymbol', [idx], this);

    }

    pushMessage(): Frame {

        return <Frame>this.mock.invoke('pushMessage', [], this);

    }

    peek(): Maybe<number> {

        return <Maybe<number>>this.mock.invoke('peek', [], nothing());

    }

    peekConstructor(): Either<Err, ConstructorInfo> {

        return <Either<Err, ConstructorInfo>>this.mock.invoke('peekConstructor',
            [], left(new Error('?')));

    }

    resolve(data: number): Either<Err, PVM_Value> {

        return <Either<Err, PVM_Value>>this.mock.invoke('resolve', [],
            left(new Error('?')));

    }

    pop(): number {

        return <number>this.mock.invoke('pop', [], 0);

    }

    popValue(): Either<Err, PVM_Value> {

        return <Either<Err, PVM_Value>>this.mock.invoke('popValue',
            [], left(new Error('?')));

    }

    popString(): Either<Err, string> {

        return <Either<Err, string>>this.mock.invoke('popString',
            [], left(new Error('?')));

    }

    popFunction(): Either<Err, PVM_Function> {

        return this.mock.invoke('popFunction', [], left(new Error('?')));

    }

    popObject(): Either<Err, PVM_Object> {

        return this.mock.invoke('popObject', [], left(new Error('?')));

    }

    popTemplate(): Either<Err, PVM_Template> {

        return this.mock.invoke('popTemplate', [], left(new Error('?')));

    }

    duplicate(): Frame {

        return <Frame>this.mock.invoke('duplicate', [], this);

    }

}

export const newFrame = (
    name = 'main',
    script = new PScript(),
    context = newContext(),
    heap = new Heap(),
    code = [],
    data = [],
    rdata = [],
    locals = [],
    ip = 0) => new FrameImpl(name, script, context, heap,
        code, data, rdata, locals, ip)
