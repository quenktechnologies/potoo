import beof from 'beof';
import Context from '../Context';

//@todo add one_for_one, one_for_all, etc. also
//provide way so notices of errors can still be publish
//in the system.

/**
 * escalate passes the error to the parent context.
 * @param {Error} error
 * @param {Conxtext} child
 * @param {Context} parent
 */
export const escalate = (error, child, parent) => {

    beof({ error }).instance(Error);
    beof({ child }).interface(Context);
    beof({ parent }).interface(Context);

    return parent.parent().tell(error);

}
