
//@todo add one_for_one, one_for_all, etc. also
//provide way so notices of errors can still be publish
//in the system.

/**
 * escalate passes the error to the parent context.
 * @param {Error} e
 * @param {Context} child
 * @param {Context} parent
 */
export function escalate(e, child, context) {

    return parent.error(e);

}
