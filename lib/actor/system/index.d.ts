import { Platform } from './vm';
/**
 * System represents a dynamic collection of actors that
 * can communicate with each other via message passing.
 *
 * This interface is normally extended and used by the main class of an
 * application as it what the various actor types rely on to access the VM.
 */
export interface System {
    /**
     * getPlatform provides the underlying VM this System uses for managing
     * actors.
     */
    getPlatform(): Platform;
}
