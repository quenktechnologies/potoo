/**
 * Message copies the enumerable properties of an object and assigns them to itself.
 *
 * This class can be used to create adhoc type hiearchies for your code bases messages.
 * @param {object} src
 */
export class Message {

    constructor(src = {}) {

        Object.keys(src).forEach(k => this[k] = src[k]);

    }

}

/**
 * Task
 */
export class Task extends Message {}

/**
 * Spawn
 * @property {string} parent
 * @property {ActorT} template
 */
export class Spawn extends Task {}

/**
 * Tell
 * @property {string} to
 * @property {*} message
 */
export class Tell extends Task {}

/**
 * Kill an Actor
 */
export class Kill extends Message {}

/**
 * Receive
 * @property {string} path
 * @property {Behaviour} behaviour
 */
export class Receive extends Task {}

/**
 * Drop
 * @property {string} to
 * @property {string} from
 * @property {*} message
 */
export class Drop extends Task {}

