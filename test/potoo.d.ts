interface ErrorConstructor {
    captureStackTrace(thisArg: any, func: any): void
}

interface Future {

    fork<A, B, C>(l: (e: Error) => B, r: (a: A) => C);

}
