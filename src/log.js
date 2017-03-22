import { match } from './Match';
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


const MESSAGES = {
    SPAWN: `Spawn child '{op.id}'`,
    TELL: `Tell actor '{op.to}' '{op.message}`,
    RECEIVE: `Started receiving.`
};

/**
 * log
 */
export const log = (op, actor) => {}
