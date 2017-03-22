import http from 'http';
import { system, spawn, tell, output, receive, stream } from 'potoo-lib';
import { LocalT, ChildT } from 'potoo-lib/Actor';
import { IO } from 'potoo-lib/monad';
import { match } from 'potoo-lib/Match';
import { Get, Stats } from './statsd';

class Visit {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
}

const makeServer = (port, cb) => () =>
    http.createServer().listen(port, (req, res) => cb(new Visit(res, res)));

const serve = m => match(m)
    .caseOf(Visit, ({ res }) => tell('/statsd', new Get('/')).chain(() => receive(wait(res))))
    .end();

const wait = res => m => match(m)
    .caseOf(Stats, () => output(() => res.send(m)).chain(() => receive(serve)))
    .end();

system()
    .spawn(new LocalT({

        id: '/',
        start: () =>
            spawn(new ChildT({ id: 'statsd', start: `${__dirname}/statsd.js` }))
            .chain(() => stream(cb => IO.of(makeServer(9000, cb))))
            .chain(() => receive(serve))

    }))
    .start().run();
