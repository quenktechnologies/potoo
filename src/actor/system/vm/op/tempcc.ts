import { Context } from '../../../context';
import { System } from '../../';
import {Frame} from '../frame';
import { Executor } from '../';
import { Log,Level } from './';

export const OP_CODE_TEMP_CC = 0x13;

/**
 * TempCC counts the number of child templates a template has.
 *
 * Pops:
 *
 * 1: Reference to the template to count.
 */
export class TempCC<C extends Context, S extends System<C>>  {

    public code = OP_CODE_TEMP_CC;

    public level = Level.Control;

    exec(e: Executor<C, S>): void {

      let curr = e.current().get();

            curr
            .resolveTemplate(curr.pop())
            .map(temp => temp.children && temp.children.length || 0)
            .map(count => curr.pushNumber(count))
            .lmap(err => e.raise(err));

    }

  toLog(f:Frame<C,S>): Log {

        return ['tempcc', [], [f.peek()]];

    }

}
