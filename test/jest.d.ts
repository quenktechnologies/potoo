/// <reference types="jest" />

export declare module 'jest-mock-extended' {
    import { DeepPartial } from 'ts-essentials';

    export type MockProxy<T> = _MockProxy<T> & T;

    export type CalledWithMock<T, Y extends any[]> = jest.Mock<T, Y>;

    export type _DeepMockProxy<T> = {
        [K in keyof T]: T[K] extends (...args: infer A) => infer B
            ? T[K] & CalledWithMock<B, A>
            : T[K] & _DeepMockProxy<T[K]>;
    };

    export type DeepMockProxy<T> = _DeepMockProxy<T> & T;

    export declare function mockDeep<T>(
        mockImplementation?: DeepPartial<T>
    ): DeepMockProxy<T>;
}
