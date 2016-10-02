import beof from 'beof';

/**
 * Signal
 */
class Signal {

    constructor(path) {

        beof({ path }).optional().string();
        this._path = path;

    }

    toString() {

        return JSON.stringify({

            path: this._path || '',
            type: 'Signal',
            signal: this.constructor.name

        });

    }

}

/**
 * Start
 */
class Start extends Signal {}

class Running extends Signal {}

class Restart extends Signal {}

class Restarted extends Signal {}

class Pause extends Signal {}

class Paused extends Signal {}

class Resume extends Signal {}

class Resumed extends Signal {}

class Stop extends Signal {}

class Stopped extends Signal {}

Signal.Start = Start;
Signal.Running = Running;
Signal.Pause = Pause;
Signal.Resume = Resume;
Signal.Resumed = Resumed;
Signal.Restart = Restart;
Signal.Restarted = Restarted;
Signal.Stop = Stop;
Signal.Stopped = Stopped;

export default Signal
