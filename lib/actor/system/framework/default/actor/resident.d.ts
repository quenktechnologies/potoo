import * as base from '../../../../resident';
import { Context } from '../../../../context';
import { ActorSystem } from '../';
/**
 * Immutable actor for use with the default system.
 */
export declare abstract class Immutable<T> extends base.Immutable<T, Context, ActorSystem> {
}
/**
 * Mutable actor for use with the default system.
 */
export declare abstract class Mutable extends base.Mutable<Context, ActorSystem> {
}
