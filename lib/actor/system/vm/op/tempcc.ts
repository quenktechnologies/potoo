import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { OP_CODE_TEMP_CC, Log, Level } from './';

/**
 * TempCC counts the number of child templates a template has.
 *
 * Pops:
 *
 * 1: Reference to the template to count.
 */
export class TempCC {

    public code = OP_CODE_TEMP_CC;

    public level = Level.Control;

    exec(e: Runtime): void {

        let curr = e.current().get();

        curr
            .resolveTemplate(curr.pop())
            .map(temp => temp.children && temp.children.length || 0)
            .map(count => curr.pushNumber(count))
            .lmap(err => e.raise(err));

    }

    toLog(f: Frame): Log {

        return ['tempcc', [], [f.peek()]];

    }

}
