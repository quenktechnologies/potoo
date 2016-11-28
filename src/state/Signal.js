import beof from 'beof';

/**
 * Signal
 */
class Signal {

    toJSON() {

        return {
            name: this.constructor.name
        };

    }

    toString() {

        return JSON.stringify(this);

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

class Closed extends Signal {

    constructor(ref) {

        super();
        this.ref = ref;

    }

}

Signal.Start = new Start();
Signal.Running = new Running();
Signal.Pause = new Pause();
Signal.Resume = new Resume();
Signal.Resumed = new Resumed();
Signal.Restart = new Restart();
Signal.Restarted = new Restarted();
Signal.Stop = new Stop();
Signal.Stopped = new Stopped();
Signal.Closed = new Closed();

export default Signal
