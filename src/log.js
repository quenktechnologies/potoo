import { match } from './Match';
import {type} from './be';
import Type from './Type';
import property from 'property-seek';
import * as Ops from './Ops';

/**
 * expandString takes a string and converts variables between {} into
 * the context value.
 * @summary (string, Object) →  string
 */
export const expandString = (s, c) => match(s)
    .caseOf('', () => '')
    .caseOf(String, s => s.replace(/\{([\w\.\-]*)\}/g, (s, k) => property(c, k)))
    .end();

/**
 * toString turns objects into string in a useful way.
 * @summary :: string →  string
 */
export const toString = str => '' + str;

const MESSAGES = {
    SPAWN: `Spawn child '{op.id}'`,
    TELL: `Tell actor '{op.to}' '{op.message}`,
    RECEIVE: `Started receiving.`
};

const LEVELS = {

    SPAWN: 'info',
    TELL: 'info',
    RECEIVE: 'info'

}

export class Log extends Type {

    constructor(props) {

        super(props, { level: type(Number), message: type });

    }

}

/**
 * logOp logs an op before it executes.
 * @summary logOp :: Op →  Free<Log, null>
 */
export const logOp = op => match(op)
    .caseOf(Spawn, ({ template }) =>
        new Log({ level: INFO, message: `Spawn child '${template.id}'` }))
    .caseOf(Tell, ({ to, message }) =>
        new Log({ level: INFO, message: `Tell '${to}' message ${toString(message)}` }))
    .caseOf(Receive, () =>
        new Log({ level: INFO, message: `Started receiving.` }))
    .end();
