import must from 'must';
import { Free, of } from 'potoo-lib/fpl/monad/Free';

const sqr = x => x * x;

export const mapTest = (v, op) => {
    let _op = op.map(sqr);
    return must(_op).be.instanceOf(op.constructor) ||
        must(_op.next).be(v);
};

export const mapTestGet = (i, v, op) => {

    let _op = op.map(sqr);
    return must(_op).instanceOf(op.constructor) ||
        must(_op.next(i)).be(v);

}

export const apiTest = (x, T) =>
    must(x).be.instanceOf(Free) ||
    must(x.go(fun => must(fun).be.instanceOf(T) ||
        fun.next ? fun.next : of()) == null).be.true();

export const apiTestGet = (i, x, T) => {

    must(x).be.instanceOf(Free);
    must(x.go(fun => {

        must(fun).be.instanceOf(T);
        return fun.next(i);

    })).be(i);

}
