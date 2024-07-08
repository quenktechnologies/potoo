const {
    init,
    receive,
    tell,
    exit,
    self
} = require('../../../lib/actor/framework/process');
const { Case } = require('../../../lib/actor/framework/resident');

init();

const main = async () => {
    console.debug('ping.js: in run block');

    let parent = await receive();

    tell(parent, 'started');

    console.debug(`ping.js: received parent address "${parent}"`);

    while (true) {
        await receive([
            new Case('ping', async () => {
                console.debug('ping.js: received ping');
                await tell(parent, 'pong');
            }),

            new Case('self', async () => {
                console.debug('ping.js: received self');
                await tell(parent, self);
            }),

            new Case('parent', async () => {
                console.debug('ping.js: received parent');
                await tell(parent, parent);
            }),

            new Case('exit', async () => {
                console.debug('ping.js: received exit');
                await tell(parent, 'exiting');
                exit();
            })
        ]);
    }
};

main();
