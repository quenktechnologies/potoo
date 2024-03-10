import { Immutable } from './';

/**
 * Callback provides an actor that will successfully process one and only one
 * message before exiting.
 *
 * Unmatched messages are ignored.
 */
export abstract class Callback<T> extends Immutable<T> {}
