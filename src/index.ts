import { System, Configuration } from './System';
import { LocalActor, Template as LocalTemplate } from './LocalActor';
import { LocalContext } from './LocalContext';
import { Template } from './Template';
import { Case } from './Case';

/**
 * system creates a new actor system with the specified configuration.
 */
export const system = (c?: Configuration): System => System.create(c);

export { System as System };
export { LocalTemplate as LocalTemplate };
export { LocalActor as LocalActor };
export { LocalContext as LocalContext };
export { Template as Template };
export { Case as Case };
