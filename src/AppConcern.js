import beof from 'beof';
import Context from './Context';
import Signal from './state/Signal';
import OneForOneStrategy from './OneForOneStrategy';

/**
 * AppConcern is a basic Concern that does just enough to satisfy the Concern
 * interface
 * @implements {Concern}
 */
class AppConcern {

    constructor(context) {

        beof({ context }).interface(Context);

        this.context = context;

    }

    onStart() {}

    onReceive() {}

    onPause() {}

    onResmue() {}

    onRestart() {}

    onStop() {}

}

export default AppConcern
