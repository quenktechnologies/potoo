import { Err } from '@quenk/noni/lib/control/err';
import { isArray } from '@quenk/noni/lib/data/type';
import { ACTION_RAISE, Template } from '../../../template';
import { FunInfo, NewForeignFunInfo } from '../script/info';
import { Thread } from '../thread';
import { PTObject } from './';

/**
 * PTTemplate is an object that encapsulates the information needed to create
 * an instance of an actor.
 */
export class PTTemplate implements PTObject {
    /**
     * @param create - Function used to instantiate the actor.
     * @param trap   - Function used to handle errors.
     * @param group  - Group assignment for the actor.
     * @param id     - Id used when creating the actor's address.
     */
    constructor(
        public create: FunInfo,
        public trap: FunInfo,
        public group: string[],
        public id?: string
    ) {}

    /**
     * fromJSTemplate converts a Template into a vm compatible PTTemplate.
     */
    static fromJSTemplate(tmpl: Template): PTTemplate {
        return new PTTemplate(
            new NewForeignFunInfo('create', 1, tmpl.create),
            new NewForeignFunInfo('trap', 1, (_: Thread, err: Err) =>
                tmpl.trap ? tmpl.trap(err) : ACTION_RAISE
            ),
            tmpl.group ? (isArray(tmpl.group) ? tmpl.group : [tmpl.group]) : [],
            tmpl.id || ''
        );
    }
}
