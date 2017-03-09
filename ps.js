module.exports =  (f) => Array(f.length).reduce(f => x => f(x), f);

module.exports.many = (a, b, c) => a + b + c;

//var r = partial(many);
