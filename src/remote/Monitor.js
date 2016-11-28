import beof from 'beof';
import Signal from '../state/Signal';
import InvalidMessage from './InvalidMessage';
import RemoteReference from './RemoteReference';
import Peer from './Peer';
import System from '../System';

/**
 * Monitor provides a monitor over a remote association to provide
 * a more stable experience.
 *
 * It looks out for errors, disconnections and messages and passes them
 * onto the relevant code.
 * @param {object} config - Configuration directives for the remote
 * @param {System} system
 *
 * message = {
 *
 *  namespace: 'system',
 *  to: 'parent:///app/main',
 *  from: '/app/worker'
 *  body: *
 * }
 */
class Monitor {

    constructor(transport, system, config = {}) {

        beof({ transport }).interface(Peer);
        beof({ system }).interface(System);
        beof({ config }).optional().object();

        this._transport = transport;
        this._system = system;
        this._config = config;

    }

    _handleSystemMessage(message) {

        var m;
        var to = message.to;
        var from = message.from;

        if (Signal.hasOwnProperty(message.body.name))
            m = Signal[message.body.signal].newInstance();
        else if (message.body.name === 'InvalidMessage')
            return this._system.emit('log', `Remote: ${message.body.message}`);
        else
            m = message.body;

        this._system.select(to).tell(m, new RemoteReference(from, this._transport));

    }

    _handleUserMessage(message) {

        var to = message.to;
        var from = message.from;

        this._system.select(to).tell(message.body, new RemoteReference(from, this._transport));

    }

    /**
     * associate the transport with this Monitor.
     */
    associate() {

        this._transport.associate(this).
        catch(e => this._system.shutdown(err));

    }

    /**
     * error is called when the remote transport has encountered and error.
     * Should not be used for user space errors.
     * @param {Error} err
     */
    error(err) {

        //@todo In the future we will support restarting on error
        //if specified in the config, for now, shutdown the whole system.
        this._system.shutdown(err);

    }

    /**
     * closed is called when we lose our connection to the remote system.
     */
    closed() {

        //Needs to be impoved significantly for now this just gives an idea of
        //what could be done.
        //
        if (this._config['keep_alive'])
            return this.associate();

        this._system.emit('closed');


    }

    /**
     * message is called to deliver a message to the intended local
     * recipient.
     * @param {object} message
     */
    message(message) {

        if (typeof message === 'object') {

            if (typeof message.to === 'string')
                if (typeof message.namespace === 'string')
                    if (message.hasOwnProperty('body')) {

                        if (message.namespace === 'system') {

                            return this._handleSystemMessage(message);

                        } else if (message.namespace === 'user') {

                            return this._handleUserMessage(message);

                        }
                    }

            this._transport.send({
                namespace: 'system',
                to: '/remote',
                from: '/remote',
                body: new InvalidMessage(message)
            });

            this._system.emit('log', +new InvalidMessage(message));

        }

    }

}

export default Monitor
