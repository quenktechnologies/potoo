import IsomorphicSystem from 'potoo-lib/IsomorphicSystem';
import bytes from 'bytes';
var system = new IsomorphicSystem();
var buffer = [];
var ref;
var collect = context => (m => {
    buffer.push(m);
    if (m === 'die')
        return m;
    return context.receive(collect);

});
var start = context => context.receive(collect(context));
var run = (ref, i) => (setTimeout(() => ref.tell('data'), (i * 2)), ref);
var pre = process.memoryUsage();
var humanize = o => {

    var oo = {};

    Object.keys(o).forEach(k => {
        oo[k] = bytes(o[k]);
    });

    return oo;

};
var measure = () => {

    var neu = process.memoryUsage();
    var diff = neu.heapTotal - pre.heapTotal;
    if (diff !== 0) {
        console.info(`Heap Change ${bytes(diff)}`);
    }
    pre = neu;

}

console.log('Start: ', humanize(process.memoryUsage()));
for (var i = 0; i < 1000000; i++) {

    ref = run(system.spawn({ start }), i);
    measure();
    ref.tell('more data');
    ref.tell('die');
    measure();

}

console.log('Spawned: ', humanize(process.memoryUsage()));
