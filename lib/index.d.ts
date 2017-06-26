import { LocalActor, Template as LocalTemplate } from './LocalActor';
import { Case } from './Case';
import { System, Configuration } from './System';
/**
 * system creates a new actor system with the specified configuration.
 */
export declare const system: (c?: Configuration) => System;
export { System as System };
export { LocalTemplate as LocalTemplate };
export { LocalActor as LocalActor };
export { Case as Case };
