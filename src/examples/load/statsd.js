import os from 'os';
import { IO } from 'potoo-lib/monad';
import { input, receive, tell, stream } from 'potoo-lib';
import { compose } from 'potoo-lib/util';
import { match } from 'potoo-lib/Match';

export class Get { constructor(client) { this.client = client; } }
export class Stats { constructor(data) { this.data = data; } }

const hostname = o => IO.of(os.hostname).map(assign('hostname', o));
const freemem = o => IO.of(os.freemem).map(assign('freemem', o));
const loadavg = o => IO.of(os.loadvg).map(assign('load', o));
const uptime = o => IO.of(os.uptime).map(assign('uptime', o));
const assign = (k, m) => v => Object.assign({}, m, {
    [k]: v
});

const refresh = input(() =>
    hostname({})
    .chain(freemem)
    .chain(loadavg)
    .chain(uptime));

const behaviour = s => m => match(m)
    .caseOf('refresh', () => refresh().chain(compose(receive, behaviour)))
    .caseOf(Get, ({ client }) => tell(client, new Stats(s)).chain(() => receive(behaviour(s))))
    .end();

export default () => refresh()
    .chain(compose(receive, behaviour))
    .chain(() => stream(f => setInterval(() => f('refresh'), 200)));
