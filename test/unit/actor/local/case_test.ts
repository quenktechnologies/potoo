import * as must from 'must/register';
import { combine, combineA, Case } from '../../../../src/actor/local/case';

class A { }

const stringF = (_: string) => { }
const numberF = (_: number) => { }
const classF = (_: A) => { }

describe('case', () => {

    describe('combine', () => {

        it('must combine 2 or more case functions', () => {

            let f = (_: Date) => new Case(String, stringF);
            let g = (_: Date) => new Case(Number, numberF);
            let h = (_: Date) => new Case(A, classF);
            let cases = combine(f, g, h)(new Date());

            must(cases.length).be(3);

        })

    })

    describe('combineA', () => {

        it('must combine 2 or more case functions', () => {

            let f = (_: Date) => [new Case(String, stringF)];
            let g = (_: Date) => [new Case(Number, numberF), new Case(String, stringF)];
            let h = (_: Date) => [new Case(A, classF), new Case(String, stringF), new Case(Number, numberF)];
            let cases = combineA<Date, string | number>(f, g, h)(new Date());

            must(cases.length).be(6);

        })

    })

})
