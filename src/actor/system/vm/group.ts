import { Address } from '../../address';

/**
 * GroupName is the name of a group complying to the regex [a-z][a-z0-9_]* .
 */
export type GroupName = string;

/**
 * GroupMap is a mapping of group names to the addresses that form part of the
 * group.
 */
export class GroupMap {
    constructor(public groups = new Map()) {}

    /**
     * enroll an actor address into one or more groups.
     *
     * If the target group(s) do not exist, they are created.
     */
enroll (actor:Address,  target: GroupName|GroupName[])   {
       let targets = Array.isArray(target) ? target : [target];
        for(let target of targets) {
        let group = this.groups.get(target) ?? new Set();
        group.add(actor);
        this.groups.set(target, group);
        }
        return this;
    }

/**
 * getMembers returns the addresses for members of a group.
 */
 getMembers (key: GroupName): Address[] {
    return [...(this.groups.get(key) ?? []  )]
}

/**
 * unenroll removes an actor address from any groups it is a member of.
 */
unenroll(actor:Address) {
  for(let group of this.groups.values()) {
    if(group.has(actor))
    group.delete(actor);
  }
  return this;
}
}
