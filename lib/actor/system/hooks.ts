import { Envelope } from '../mailbox';

/**
 * Drop hook.
 */
export type Drop = (e: Envelope) => void;

/**
 * Hooks that can override specific events during execution
 */
export interface Hooks {

    /**
     * drop hook
     *
     * Can be invoked to intercept dropped messages.
     */
    drop?: Drop

}

