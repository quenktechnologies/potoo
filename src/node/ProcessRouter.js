import beof from 'beof';
import Context from '../Context';
import Signal from '../Signal';
import RemoteMessage from '../RemoteMessage';
import ParentReference from './ParentReference';

/**
 * ProcessRouter is a class for treating the current process as a
 * system.
 * @param {Context} context
 */
class ProcessRouter {

    constructor(context) {

        beof({ context }).interface(Context);

        process.on('message', message => {

            var m;

            try {
                m = JSON.parse(message);
                assert.ok(typeof m === 'object');
            } catch (e) {
                return context.publish(new InvalidMessageError(message, ''));
            }

            if (m.type === 'signal') {

                context.select(m.path).accept(new Signal[m.type](m.path), new ParentReference(process));

            } else if (RemoteMessage.is(m)) {

                this._context.select(m.to).accept(m.body, new ParentReference(process));

            } else {

                context.publish(new InvalidMessageError(m, ''));

            }

        });

        ctx.on('generate', function(concern) {

            concern.watch(function(old, neu) {

                process.send(neu.toString());

            });

        });

    }

}

export default ProcessRouter
