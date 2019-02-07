import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import { Context } from '../context';
import { Address } from '../address';
import {  Instance } from '../';
import { Value, Script } from './vm/script';

/**
 * System represents a dynamic collection of actors that 
 * can communicate with each other via message passing.
 */
export interface System<C extends Context> extends Instance {

    ident(i: Instance): Address

    exec(i: Instance, s: Script<C, any>): Maybe<Value<C, any>>

}

/**
 * Void system.
 *
 * This can be used to prevent a stopped actor from executing further commands.
 */
export class Void<C extends Context> implements System<C> {

    ident(): Address {

        return '?';

    }

  accept(): void {
  
  }

  run(): void {
  
  }

  notify(): void {


  }

  stop(): void {


  }

    exec(_: Instance, __: Script<C, any>): Maybe<Value<C, any>> {

        return nothing();

    }

}
