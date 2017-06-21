/**
 * Behaviour of an actor
 */
export interface Behaviour {
    <M>(m: M): any;
}
