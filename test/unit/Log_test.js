import * as Log from 'potoo-lib/Log';
import { mapTest, apiTest } from './helpers';

describe('map', function() {

    it('should work properly', function() {

        mapTest(144, new Log.Log({
            level: 3,
            message: '',
            next: 12
        }));


    });

});

describe('api', function() {

    it('debug :: () →  Free<Log, *>', function() {

        apiTest(Log.debug(''), Log.Log);

    });

    it('info :: () →  Free<Log, *>', function() {

        apiTest(Log.info(''), Log.Log);

    });

    it('warn :: () →  Free<Log, *>', function() {

        apiTest(Log.warn(''), Log.Log);

    });

    it('error :: () →  Free<Log, *>', function() {

        apiTest(Log.warn(''), Log.Log);

    });

});
