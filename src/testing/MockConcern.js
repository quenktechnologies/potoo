/**
 * MockConcern
 */
class MockConcern {

    constructor() {

        this.calls = {
            onStart: 0,
            onRestart: 0,
            onStop: 0,
            onPause: 0,
            onResume: 0
        };

    }

    onStart() {this.calls.onStart++; }

    onPause() { this.calls.onPause++;}

    onResume() { this.calls.onResume++;}

    onRestart() { this.calls.onRestart++;}

    onStop() { this.calls.onStop++;}

}

export default MockConcern
