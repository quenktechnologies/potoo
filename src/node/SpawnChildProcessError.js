import Error from 'es6-error';

/**
 * SpawnChildProcessError
 */
class SpawnChildProcessError extends Error {

    constructor(e) {

        super(e.message);

    }

}

export default SpawnChildProcessError
