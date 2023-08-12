const { doFuture, voidPure } = require('@quenk/noni/lib/control/monad/future');

const {
    init,
    receive,
    select,
    tell,
    exit,
    self
} = require('../../../lib/actor/remote/process');
const { Case } = require('../../../lib/actor/resident/case');

init();

doFuture(function*() {

    console.info('ping.js: in run block');

    let parent = yield receive();

    console.info(`ping.js: received parent address "${parent}"`);

    tell(parent, 'started');

    while (true) {

        console.info('ping.js: blocking for select');

        yield select([

            new Case('ping', () => tell(parent, 'pong')),

            new Case('self', () => tell(parent, self())),

            new Case('parent', () => tell(parent, parent)),

            new Case('exit', () => {

                tell(parent, 'exiting');

                exit();

            })
        ]);

    }

    return voidPure;

}).fork();
