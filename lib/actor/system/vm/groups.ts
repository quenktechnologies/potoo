import { contains } from '@quenk/noni/lib/data/array';
import { Address } from '../../address';

import {Map} from './map';

/**
 * GroupName is the name of a group complying to the regex [a-z][a-z0-9_]* .
 */
export type GroupName = string;

/**
 * GroupMap is a mapping of group names to the addresses that form part of the
 * group.
 */
export class GroupMap extends Map<Address[]> {

  /**
   * put the address of an actor into a group.
   */
  put(key:GroupName, value: Address) : GroupMap {

    let group = this.get(key).orJust(()=> <string[]>[]).get();

    if(!contains(group, value))    group.push(value);

    this.set(key, group);

    return this;

  }

}
