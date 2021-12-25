import { Mock } from '@quenk/test/lib/mock';
import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import { Either, left } from '@quenk/noni/lib/data/either';
import { Err } from '@quenk/noni/lib/control/error';
import { Type } from '@quenk/noni/lib/data/type';

import {
    PScript,
} from '../../../../../lib/actor/system/vm/script';
import { Frame } from '../../../../../lib/actor/system/vm/runtime/stack/frame';
import { FunInfo, Info } from '../../../../../lib/actor/system/vm/script/info';
import { PTValue } from '../../../../../lib/actor/system/vm/type';
import { newContext } from './context';
import { newThread } from './thread';
import { HeapObject } from '../../../../../lib/actor/system/vm/runtime/heap/ledger';

export class FrameImpl implements Frame {

    constructor(
        public name = 'main',
        public script = new PScript('test'),
        public context = newContext(),
        public thread = newThread(),
        public parent: Maybe<Frame> = nothing(),
        public code = [],
        public data = [],
        public rdata = [],
        public locals = [],
        public ip = 0) { }

    mock = new Mock();

    getPosition(): number {

        return this.mock.invoke<number>('getPosition', [], 0);

    }

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

    pushName(idx: number): Frame {

        return <Frame>this.mock.invoke('pushName', [idx], this);

    }

    pushMessage(): Frame {

        return <Frame>this.mock.invoke('pushMessage', [], this);

    }

    pushSelf(): Frame {

        return this.mock.invoke('pushSelf', [], this);

    }

    peek(): Maybe<number> {

        return <Maybe<number>>this.mock.invoke('peek', [], nothing());

    }

    resolve(data: number): Either<Err, PTValue> {

        return <Either<Err, PTValue>>this.mock.invoke('resolve', [data],
            left(new Error('?')));

    }

    pop(): number {

        return <number>this.mock.invoke('pop', [], 0);

    }

    popValue(): Either<Err, PTValue> {

        return <Either<Err, PTValue>>this.mock.invoke('popValue',
            [], left(new Error('?')));

    }

    popString(): Either<Err, string> {

        return <Either<Err, string>>this.mock.invoke('popString',
            [], left(new Error('?')));

    }

    popName(): Either<Err, Info> {

        return <Either<Err, Info>>this.mock.invoke('popName',
            [], left(new Error('?')));

    }

    popFunction(): Either<Err, FunInfo> {

        return this.mock.invoke('popFunction', [], left(new Error('?')));

    }

    popObject(): Either<Err, HeapObject> {

        return this.mock.invoke('popObject', [], left(new Error('?')));

    }

    popForeign(): Either<Err, Type> {

        return this.mock.invoke('popForeign', [], left(new Error('?')));

    }

    duplicate(): Frame {

        return <Frame>this.mock.invoke('duplicate', [], this);

    }

    advance(): Frame {

        return <Frame>this.mock.invoke('advance', [], this);

    }

    seek(loc: number): Frame {

        return <Frame>this.mock.invoke('seek', [loc], this);

    }

    isFinished(): boolean {

        return <boolean>this.mock.invoke('advance', [], true);

    }

}

export const newFrame = (
    name = 'main',
    script = new PScript('test'),
    context = newContext(),
    thread = newThread(),
    code = [],
    data = [],
    rdata = [],
    locals = [],
    ip = 0) => new FrameImpl(name, script, context, thread, nothing(),
        code, data, rdata, locals, ip)
